#!/usr/bin/env node
import { Command } from 'commander'
import { createUser } from '@/src/commands/create-user'

async function main() {
  const program = new Command()
    .name('morpheus')
    .description('Morpheus CLI')
    .version('1.0.0')

  program.addCommand(createUser)
  program.parse()
}

main()
