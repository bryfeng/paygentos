import Link from 'next/link'

export default function AgentPlatformCorePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <Link href="/" className="text-blue-500 hover:underline mb-8 block">
          &larr; Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Agent Platform Core</h1>
        
        <div className="bg-white/30 p-8 rounded-lg shadow-lg backdrop-blur-sm">
          <h2 className="text-2xl font-semibold mb-4">Platform Core Overview</h2>
          <p className="mb-4">
            The Agent Platform Core provides foundational capabilities for all agents in the system,
            enabling consistent behavior and shared functionality across different agent types.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">Core Components</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Link href="#" className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <h4 className="font-semibold">Agent Runtime</h4>
              <p className="text-sm text-gray-600">Execution environment for agent operations</p>
            </Link>
            
            <Link href="#" className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <h4 className="font-semibold">Conversation</h4>
              <p className="text-sm text-gray-600">User interaction and communication capabilities</p>
            </Link>
            
            <Link href="#" className="p-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
              <h4 className="font-semibold">Task Planning</h4>
              <p className="text-sm text-gray-600">Workflow management and task execution</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
