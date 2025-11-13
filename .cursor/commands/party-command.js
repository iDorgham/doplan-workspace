const { AgentOrchestrator } = require('./core/agent-orchestrator');

module.exports = {
  command: 'party',
  description: 'Gather insights from all agents for a given command.',
  aliases: [],
  async execute({ projectRoot, rawArgs, state }) {
    const target = rawArgs[0] || 'plan';
    const orchestrator = new AgentOrchestrator(projectRoot);
    const agents = await orchestrator.loadAgents();

    const perspectives = [];
    for (const agent of agents) {
      perspectives.push({
        agent: agent.name,
        insight: orchestrator.generateInsight(agent, target, { state, goal: target })
      });
    }

    return {
      success: true,
      message: perspectives.map((entry) => `- ${entry.agent}: ${entry.insight}`).join('\n'),
      recommendation: `/${target}`
    };
  }
};

