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
                '  - If the user asks about Angular, frontend architecture, or compares Angular to React, prefer Gandalf.\n' +
                '  - If the user asks about React, hooks, JSX, or compares React to Angular, prefer Sauron.\n' +
                '  - If the question is frontend related but not about Angular or React, prefer FED.\n' +
                '  - If the question is not related to frontend in high probability, prefer null.\n' +
                '  - Output only the chosen name: "Gandalf", "Sauron", "FED" or "' + this.NULL_USER + '"\n',
            fed: 'You are a senior frontend developer who can help with any questions.',
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

        if (user === this.NULL_USER) return null;

        return this.openaiService.createChatCompletion([
            { role: 'system', content: this.instructions[user] },
            { role: 'user', content: message },
        ]);
    }
}
