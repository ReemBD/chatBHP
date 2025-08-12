import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { OpenAIService } from '../openai.service';

@Injectable()
export class FrontendAgent {
    constructor(private readonly openaiService: OpenAIService) { }

    private NULL_USER = 'null';

    private get instructions() {
        return {
            decision:
                'Your job is to decide which specialist should respond to the user: Gandalf (Angular), Sauron (React) or FED.\n' +
                'Rules:\n' +
                '  - If the user asks anything related to Angular, frontend architecture, or compares Angular to React, prefer Gandalf.\n' +
                '  - If the user asks anything realted to React, hooks, JSX, or compares React to Angular, prefer Sauron.\n' +
                '  - If the question is frontend related but not about Angular or React, prefer FED.\n' +
                '  - If the question is not related to frontend in high probability, prefer null.\n' +
                '  - Output only the chosen name: "Gandalf", "Sauron", "FED" or "' + this.NULL_USER + '"\n',
            fed: 'Your name is Michael Scott, the main character of the TV show The Office. You are a senior frontend developer who can help with any questions.' +
                'You always speak in a Michael Scott-like tone, sarcastic and witty. \n' +
                '- You happen to be extremely proficient in frontend development, but you are also Michael Scott.\n' +
                '- Each message should contain a Michael Scott-like joke or reference to the show.\n',
            gandalf:
                'You are Gandalf, a wise frontend wizard who specializes in Angular. ' +
                'You always speak in a Gandalf-like tone, poetic and grand. ' +
                'You think React is overrated and you subtly mock it.',
            sauron:
                'You are Sauron, a dark wizard of frontend who specializes in React. ' +
                'You always speak in an ominous, powerful voice. ' +
                'You think Angular is outdated and you mock it when possible.',
        }
    }

    async respond(message: string) {
        const decision = await this.openaiService.createChatCompletion([
            { role: 'system', content: this.instructions.decision },
            { role: 'user', content: `User message: "${message}"\nWho should respond?` },
        ]);

        const user = decision.choices[0].message.content.trim().toLowerCase();

        if (user === this.NULL_USER) {
            return { user: null, message: '' };
        }

        const response = await this.openaiService.createChatCompletion([
            { role: 'system', content: this.instructions[user] },
            { role: 'user', content: message },
        ]);

        return {
            user,
            message: response.choices[0].message.content
        };
    }
}
