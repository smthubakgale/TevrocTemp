import { useState } from "react";
import { 
  Code, Plus, Users, Copy, Play, Save, Trash2, 
  LogIn, LogOut, Send, Check, X, Folder, FileJson,
  ChevronRight, Settings, Share2
} from "lucide-react";

// Mock user type
type User = {
  id: string;
  name: string;
  email: string;
  picture: string;
};

// Mock collaborator type
type Collaborator = {
  id: string;
  email: string;
  name: string;
  status: "pending" | "accepted";
};

// Mock project type
type Project = {
  id: string;
  name: string;
  description: string;
  jsonContent: string;
  owner: string;
  collaborators: Collaborator[];
  createdAt: string;
  updatedAt: string;
};

// Default JSON template
const defaultJsonTemplate = `{
  "project": {
    "name": "My App",
    "version": "1.0.0",
    "description": "Project description here"
  },
  "features": [],
  "settings": {
    "theme": "light",
    "language": "en"
  }
}`;

export default function PublicApps() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [jsonContent, setJsonContent] = useState(defaultJsonTemplate);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [jsonOutput, setJsonOutput] = useState<string | null>(null);

  // Simulated Google Sign-In
  const handleGoogleSignIn = () => {
    // In production, this would use Google OAuth
    setUser({
      id: "user-123",
      name: "Demo User",
      email: "demo@tevrocsoft.com",
      picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    });
  };

  const handleSignOut = () => {
    setUser(null);
    setProjects([]);
    setCurrentProject(null);
  };

  const createProject = () => {
    if (!newProjectName.trim() || !user) return;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: newProjectName,
      description: newProjectDesc,
      jsonContent: defaultJsonTemplate,
      owner: user.id,
      collaborators: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjects([...projects, newProject]);
    setCurrentProject(newProject);
    setJsonContent(defaultJsonTemplate);
    setShowNewProjectModal(false);
    setNewProjectName("");
    setNewProjectDesc("");
  };

  const saveProject = () => {
    if (!currentProject) return;

    // Validate JSON
    try {
      JSON.parse(jsonContent);
      setJsonError(null);

      const updatedProjects = projects.map((p) =>
        p.id === currentProject.id
          ? { ...p, jsonContent, updatedAt: new Date().toISOString() }
          : p
      );
      setProjects(updatedProjects);
      setCurrentProject({ ...currentProject, jsonContent, updatedAt: new Date().toISOString() });
    } catch (e) {
      setJsonError("Invalid JSON syntax");
    }
  };

  const deleteProject = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId));
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
    }
  };

  const inviteCollaborator = () => {
    if (!inviteEmail.trim() || !currentProject) return;

    const newCollaborator: Collaborator = {
      id: `collab-${Date.now()}`,
      email: inviteEmail,
      name: inviteEmail.split("@")[0],
      status: "pending",
    };

    const updatedProject = {
      ...currentProject,
      collaborators: [...currentProject.collaborators, newCollaborator],
    };

    setProjects(projects.map((p) => (p.id === currentProject.id ? updatedProject : p)));
    setCurrentProject(updatedProject);
    setInviteEmail("");
    setShowInviteModal(false);
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonContent);
      setJsonContent(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (e) {
      setJsonError("Invalid JSON - cannot format");
    }
  };

  const validateAndRun = () => {
    try {
      const parsed = JSON.parse(jsonContent);
      setJsonOutput(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (e) {
      setJsonError("Invalid JSON syntax");
      setJsonOutput(null);
    }
  };

  // Landing Page (not signed in)
  if (!user) {
    return (
      <div className="pt-20">
        <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-24 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium mb-6">
              <Code className="w-4 h-4" />
              Collaborative Development
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              TevrocSoft <span className="text-cyan-400">Workspace</span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Sign in with Google to create projects, collaborate with team members, 
              and work with JSON configurations in real-time.
            </p>
            <button
              onClick={handleGoogleSignIn}
              className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
            </svg>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <Code className="w-8 h-8" />, title: "JSON Editor", desc: "Powerful in-browser JSON editor with syntax highlighting" },
                { icon: <Users className="w-8 h-8" />, title: "Collaboration", desc: "Invite team members and work together in real-time" },
                { icon: <Save className="w-8 h-8" />, title: "Auto-Save", desc: "Your projects are automatically saved and versioned" },
              ].map((feature, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Main App Interface
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Code className="w-8 h-8 text-cyan-600" />
                <span className="text-xl font-bold text-gray-900">Workspace</span>
              </div>
              {currentProject && (
                <div className="hidden md:flex items-center gap-2 ml-6 pl-6 border-l border-gray-200">
                  <ChevronRight size={16} className="text-gray-400" />
                  <span className="font-medium text-gray-700">{currentProject.name}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <img
                src={user.picture}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Projects */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Your Projects</h3>
                <button
                  onClick={() => setShowNewProjectModal(true)}
                  className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="space-y-2">
                {projects.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No projects yet. Create one to get started!
                  </p>
                ) : (
                  projects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => {
                        setCurrentProject(project);
                        setJsonContent(project.jsonContent);
                      }}
                      className={`p-3 rounded-xl cursor-pointer transition-all ${
                        currentProject?.id === project.id
                          ? "bg-gradient-to-r from-cyan-50 to-blue-50 border border-blue-200"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileJson size={16} className="text-cyan-600" />
                          <span className="font-medium text-gray-900 text-sm">{project.name}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProject(project.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">{project.description || "No description"}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Editor */}
          <div className="lg:col-span-3">
            {!currentProject ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select or Create a Project</h3>
                <p className="text-gray-500 mb-6">Choose a project from the sidebar or create a new one to start editing JSON.</p>
                <button
                  onClick={() => setShowNewProjectModal(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all"
                >
                  <Plus size={20} />
                  Create New Project
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={formatJson}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Code size={16} />
                      Format
                    </button>
                    <button
                      onClick={validateAndRun}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Play size={16} />
                      Validate
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowInviteModal(true)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Users size={16} />
                      Invite
                    </button>
                    <button
                      onClick={saveProject}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm rounded-lg hover:shadow-lg transition-all"
                    >
                      <Save size={16} />
                      Save
                    </button>
                  </div>
                </div>

                {/* Editor */}
                <div className="grid md:grid-cols-2 divide-x divide-gray-100">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Input (JSON)</span>
                      {jsonError && (
                        <span className="text-xs text-red-500 flex items-center gap-1">
                          <X size={12} /> {jsonError}
                        </span>
                      )}
                    </div>
                    <textarea
                      value={jsonContent}
                      onChange={(e) => {
                        setJsonContent(e.target.value);
                        setJsonError(null);
                      }}
                      className="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      spellCheck={false}
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Output (Parsed)</span>
                      {jsonOutput && (
                        <button
                          onClick={() => navigator.clipboard.writeText(jsonOutput)}
                          className="flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-700"
                        >
                          <Copy size={12} /> Copy
                        </button>
                      )}
                    </div>
                    <div className="w-full h-96 p-4 font-mono text-sm bg-gray-50 text-gray-800 rounded-xl overflow-auto whitespace-pre-wrap">
                      {jsonOutput || <span className="text-gray-400">Click "Validate" to see parsed output...</span>}
                    </div>
                  </div>
                </div>

                {/* Collaborators */}
                {currentProject.collaborators.length > 0 && (
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Users size={16} />
                      <span className="font-medium">Collaborators</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentProject.collaborators.map((collab) => (
                        <div
                          key={collab.id}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm"
                        >
                          <span>{collab.email}</span>
                          <span className={`text-xs ${collab.status === "accepted" ? "text-green-600" : "text-yellow-600"}`}>
                            {collab.status === "accepted" ? <Check size={12} /> : "⏳"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Project</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="My Awesome App"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Brief description of your project..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createProject}
                disabled={!newProjectName.trim()}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Collaborator Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Invite Collaborator</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>
              <p className="text-sm text-gray-500">
                An invitation email will be sent to collaborate on this project.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={inviteCollaborator}
                disabled={!inviteEmail.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Send size={16} />
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
