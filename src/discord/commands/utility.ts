// Utility Commands
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, Client } from 'discord.js';
import { CommandHandler } from '../types';

export const utilityCommands: CommandHandler[] = [
    {
        data: new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Check bot latency'),
        async execute(interaction: ChatInputCommandInteraction): Promise<void> {
            void await interaction.reply({ content: 'Pinging...', fetchReply: true })
                .then(sent => {
                    const latency = sent.createdTimestamp - interaction.createdTimestamp;
                    void interaction.editReply(`Pong! Latency is ${latency}ms`);
                });
            return;
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName('serverinfo')
            .setDescription('Get server information'),
        async execute(interaction: ChatInputCommandInteraction) {
            const guild = interaction.guild;
            if (!guild) return interaction.reply('Server information unavailable');

            const info = [
                `Name: ${guild.name}`,
                `Members: ${guild.memberCount}`,
                `Created: ${guild.createdAt.toDateString()}`
            ].join('\n');

            void interaction.reply(info);
        }
    }
];

export function registerUtilityCommands(client: Client): CommandHandler[] {
    return utilityCommands;
}
