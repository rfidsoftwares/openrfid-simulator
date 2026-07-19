#!/usr/bin/env node
/**
 * OpenRFID Simulator - The Open Source RFID Reader Simulator for Developers.
 * Copyright (c) 2026 RFID Software India Private Limited - https://rfidsoftwares.com
 *
 * Licensed under the MIT License.
 * For RFID software, enterprise tools, and hardware drivers, visit https://rfidsoftwares.com
 */

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import Table from 'cli-table3';
import { EventBus, ConfigManager, Logger, SqliteStorageDriver } from '@openrfid/core';
import { SimulatorManager } from '@openrfid/simulator';
import { PluginManager } from '@openrfid/plugin-api';
import { RestPlugin } from '@openrfid/rest';
import { WebSocketPlugin } from '@openrfid/websocket';
import { MqttPlugin } from '@openrfid/mqtt';
import { HopelandDiscoveryPlugin } from '@openrfid/hopeland-discovery';
import { VirtualReader } from '@openrfid/readers';
import { TagGenerator } from '@openrfid/tags';

const program = new Command();

program
  .name('openrfid')
  .description('OpenRFID Simulator CLI tool for headless operations and automation.')
  .version('1.0.0');

// ── INIT COMMAND ─────────────────────────────────────────────────────────────
program
  .command('init')
  .description('Initialize a new OpenRFID Simulator configuration file')
  .action(async () => {
    const configPath = path.join(process.cwd(), 'openrfid.config.json');
    if (fs.existsSync(configPath)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'openrfid.config.json already exists. Overwrite it?',
          default: false,
        },
      ]);
      if (!overwrite) {
        console.log(chalk.yellow('Initialization cancelled.'));
        return;
      }
    }

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'dbPath',
        message: 'Database storage path:',
        default: './openrfid.db',
      },
      {
        type: 'number',
        name: 'port',
        message: 'REST API Server Port:',
        default: 3000,
      },
      {
        type: 'number',
        name: 'wsPort',
        message: 'WebSocket Server Port:',
        default: 4000,
      },
      {
        type: 'confirm',
        name: 'mqttEnabled',
        message: 'Enable MQTT Broker client integration?',
        default: false,
      },
    ]);

    const configContent = {
      dbPath: answers.dbPath,
      server: {
        port: answers.port,
        host: '0.0.0.0',
      },
      websocket: {
        port: answers.wsPort,
      },
      mqtt: {
        enabled: answers.mqttEnabled,
        brokerUrl: 'mqtt://localhost:1883',
      },
      hopeland: {
        enabled: true,
        tcpPort: 9090,
        udpPort: 9091,
      },
    };

    fs.writeFileSync(configPath, JSON.stringify(configContent, null, 2));
    console.log(chalk.green(`\nSuccess! Created configuration file: ${configPath}`));
    console.log(`Run ${chalk.cyan('openrfid simulator')} to start the simulator server.`);
  });

// ── SIMULATOR HEADLESS SERVER COMMAND ──────────────────────────────────────────
program
  .command('simulator')
  .description('Start the headless simulator server')
  .option('-c, --config <path>', 'Path to openrfid.config.json', 'openrfid.config.json')
  .action(async (options) => {
    const configPath = path.resolve(process.cwd(), options.config);
    let configData: any = {};
    if (fs.existsSync(configPath)) {
      try {
        configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        console.log(chalk.blue(`[CLI] Loaded configuration from: ${configPath}`));
      } catch (err: any) {
        console.error(chalk.red(`[CLI] Error parsing config file: ${err.message}`));
        process.exit(1);
      }
    } else {
      console.log(chalk.yellow(`[CLI] No config file found at ${options.config}. Using default parameters.`));
      configData = {
        dbPath: './openrfid.db',
        server: { port: 3000, host: '0.0.0.0' },
        websocket: { port: 4000 },
        mqtt: { enabled: false },
        hopeland: { enabled: true, tcpPort: 9090, udpPort: 9091 }
      };
    }

    const spinner = ora('Starting OpenRFID Headless Services...').start();

    // Initialize core services
    const eventBus = new EventBus();
    const config = new ConfigManager(configData);
    const logger = new Logger('Simulator');
    
    const dbPath = configData.dbPath || './openrfid.db';
    const storage = new SqliteStorageDriver(dbPath);
    await storage.connect();

    const simulator = new SimulatorManager(eventBus, storage);
    const pluginManager = new PluginManager({ eventBus, config, logger, simulator, storage });

    // Register active server plugins
    pluginManager.register(new RestPlugin());
    pluginManager.register(new WebSocketPlugin());
    
    if (configData.mqtt?.enabled) {
      pluginManager.register(new MqttPlugin());
    }
    if (configData.hopeland?.enabled) {
      pluginManager.register(new HopelandDiscoveryPlugin());
    }

    await pluginManager.initializeAll();
    await pluginManager.startAll();

    // Auto-start any readers that are marked ONLINE in the DB
    const allReaders = simulator.getAllReaders();
    let onlineCount = 0;
    for (const r of allReaders) {
      if (r.status === 'ONLINE') {
        await simulator.startReader(r.id);
        onlineCount++;
      }
    }

    spinner.succeed(chalk.green('OpenRFID Headless Simulator running successfully!'));
    console.log(chalk.gray('----------------------------------------------------'));
    console.log(`* REST API Server:   ${chalk.cyan(`http://localhost:${configData.server?.port || 3000}`)}`);
    console.log(`* WebSocket Server:  ${chalk.cyan(`ws://localhost:${configData.websocket?.port || 4000}`)}`);
    if (configData.mqtt?.enabled) {
      console.log(`* MQTT Broker:       ${chalk.cyan(configData.mqtt.brokerUrl)}`);
    }
    if (configData.hopeland?.enabled) {
      console.log(`* Hopeland TCP:      ${chalk.cyan(`port ${configData.hopeland.tcpPort || 9090}`)}`);
      console.log(`* Hopeland UDP Mult: ${chalk.cyan(`port ${configData.hopeland.udpPort || 9091}`)}`);
    }
    console.log(`* SQLite Storage:    ${chalk.cyan(dbPath)} (Running: ${allReaders.length} total readers, ${onlineCount} active)`);
    console.log(chalk.gray('----------------------------------------------------'));
    console.log(chalk.yellow('Press Ctrl+C to stop the simulator server.'));

    process.on('SIGINT', async () => {
      console.log(chalk.blue('\n[CLI] Shutting down headless servers...'));
      const stopSpinner = ora('Stopping active readers and plugins...').start();
      try {
        await pluginManager.stopAll();
        await storage.disconnect();
        stopSpinner.succeed('Graceful shutdown completed.');
        process.exit(0);
      } catch (err: any) {
        stopSpinner.fail(`Error during shutdown: ${err.message}`);
        process.exit(1);
      }
    });
  });

// ── CREATE READER COMMAND ──────────────────────────────────────────────────────
program
  .command('create-reader')
  .description('Interactively create a new virtual reader')
  .option('-c, --config <path>', 'Path to openrfid.config.json', 'openrfid.config.json')
  .action(async (options) => {
    const configPath = path.resolve(process.cwd(), options.config);
    let dbPath = './openrfid.db';
    if (fs.existsSync(configPath)) {
      const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      dbPath = configData.dbPath || './openrfid.db';
    }

    const storage = new SqliteStorageDriver(dbPath);
    await storage.connect();

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Reader Name:',
        default: 'Gate-1',
      },
      {
        type: 'list',
        name: 'protocol',
        message: 'Reader Protocol:',
        choices: ['Hopeland', 'LLRP'],
        default: 'Hopeland',
      },
      {
        type: 'input',
        name: 'ip',
        message: 'Listen IP Address:',
        default: '127.0.0.1',
      },
      {
        type: 'number',
        name: 'port',
        message: 'Listen Port:',
        default: 9090,
      },
    ]);

    const reader = new VirtualReader({
      name: answers.name,
      protocol: answers.protocol,
      ip: answers.ip,
      port: answers.port,
      vendor: answers.protocol === 'Hopeland' ? 'Hopeland' : 'Generic',
      model: 'Sim passive v1',
    });

    await storage.saveReader({
      id: reader.id,
      name: reader.name,
      vendor: reader.vendor,
      model: reader.model,
      ip: reader.ip,
      port: reader.port,
      protocol: reader.protocol,
      status: 'OFFLINE',
      createdAt: new Date().toISOString(),
    });

    for (let i = 1; i <= 4; i++) {
      await storage.saveAntenna({
        id: `${reader.id}-ant-${i}`,
        readerId: reader.id,
        index: i,
        gain: 6,
        power: 30,
        frequency: 865,
        rssiOffset: 0,
        readZone: `Zone ${i}`,
        enabled: i === 1,
      });
    }

    console.log(chalk.green(`\nSuccess! Virtual reader ${answers.name} created with ID: ${reader.id}`));
    await storage.disconnect();
  });

// ── CREATE TAG COMMAND ─────────────────────────────────────────────────────────
program
  .command('create-tag')
  .description('Interactively generate a batch of virtual RFID tags')
  .option('-c, --config <path>', 'Path to openrfid.config.json', 'openrfid.config.json')
  .action(async (options) => {
    const configPath = path.resolve(process.cwd(), options.config);
    let dbPath = './openrfid.db';
    if (fs.existsSync(configPath)) {
      const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      dbPath = configData.dbPath || './openrfid.db';
    }

    const storage = new SqliteStorageDriver(dbPath);
    await storage.connect();

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Tag EPC Generation Type:',
        choices: ['sequential', 'random', 'sgtin96'],
        default: 'sequential',
      },
      {
        type: 'number',
        name: 'count',
        message: 'Number of tags to generate:',
        default: 10,
      },
    ]);

    const spinner = ora('Generating tags...').start();
    const batch = TagGenerator.generateBatch({ count: answers.count, type: answers.type as any });
    
    for (const tag of batch) {
      await storage.saveTag({
        id: tag.epc,
        epc: tag.epc,
        tid: tag.tid,
        protocol: tag.protocol,
      });
    }

    spinner.succeed(chalk.green(`Successfully generated and saved ${answers.count} tags of type: ${answers.type}`));
    await storage.disconnect();
  });

// ── MQTT TELEMETRY MONITOR COMMAND ──────────────────────────────────────────────
program
  .command('mqtt')
  .description('Launch a CLI MQTT telemetry monitoring session')
  .option('-b, --broker <url>', 'MQTT Broker URL', 'mqtt://localhost:1883')
  .action(async (options) => {
    const mqtt = require('mqtt');
    console.log(chalk.blue(`[MQTT Monitor] Connecting to MQTT broker at: ${options.broker}`));
    const client = mqtt.connect(options.broker);

    client.on('connect', () => {
      console.log(chalk.green('[MQTT Monitor] Connected! Subscribing to "openrfid/events/#"...'));
      client.subscribe('openrfid/events/#');
    });

    client.on('message', (topic: string, message: Buffer) => {
      try {
        const payload = JSON.parse(message.toString());
        const table = new Table({
          head: [chalk.cyan('Topic'), chalk.cyan('Reader ID'), chalk.cyan('EPC'), chalk.cyan('Antenna'), chalk.cyan('RSSI')],
          colWidths: [25, 20, 26, 10, 10]
        });

        table.push([
          topic,
          payload.readerId || 'N/A',
          payload.epc || 'N/A',
          payload.antennaIndex !== undefined ? payload.antennaIndex.toString() : 'N/A',
          payload.rssi !== undefined ? `${payload.rssi} dBm` : 'N/A'
        ]);

        console.log(table.toString());
      } catch (err: any) {
        console.log(chalk.red(`[MQTT Monitor] Error parsing payload: ${err.message}`));
      }
    });

    client.on('error', (err: any) => {
      console.error(chalk.red(`[MQTT Monitor] Connection error: ${err.message}`));
    });

    process.on('SIGINT', () => {
      client.end();
      console.log(chalk.yellow('\n[MQTT Monitor] Disconnected.'));
      process.exit(0);
    });
  });

program.parse(process.argv);
