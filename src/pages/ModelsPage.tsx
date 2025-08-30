import React, { useEffect, useState } from "react";
import { Upload, Download, Eye, FileText } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { useAuth } from "@/context/AuthContext";
import ModelViewer3D from "@/components/ModelViewer3D";

export default function ModelsPage() {
  const { models, fetchModels, uploadModel } = useAdmin();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchModels();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Select a file");
    setIsUploading(true);
    try {
      await uploadModel(file, name, description);
      setFile(null);
      setName("");
      setDescription("");
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">3D Models</h2>
          <p className="text-gray-600">
            Manage and preview your 3D model collection
          </p>
        </div>

        {/* Upload Form */}
        {user?.role === "ADMIN" && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-blue-600" />
                Upload New Model
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Model Name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                    required
                  />
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept=".glb,.gltf"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                    />
                  </div>
                  <button
                    onClick={submit}
                    disabled={isUploading}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3D Model Viewer Modal */}
        {selectedModel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {selectedModel.name}
                  </h3>
                  <button
                    onClick={() => setSelectedModel(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-600 mt-1">{selectedModel.description}</p>
              </div>
              <div className="p-6">
                <div className="bg-gray-100 rounded-xl overflow-hidden">
                  <ModelViewer3D
                    glbUrl={selectedModel.fileUrl}
                    alt={selectedModel.name}
                    height="500px"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((m: any) => (
            <div
              key={m._id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                <ModelViewer3D glbUrl={m.fileUrl} alt={m.name} height="192px" />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => setSelectedModel(m)}
                    className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold flex items-center shadow-lg transform translate-y-2 hover:translate-y-0 transition-all duration-300"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View 3D
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {m.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {m.description}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedModel(m)}
                    className="flex-1 bg-blue-50 text-blue-600 py-2 px-4 rounded-xl font-medium hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </button>
                  <a
                    href={m.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-50 text-green-600 py-2 px-4 rounded-xl font-medium hover:bg-green-100 transition-colors duration-200 flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {models.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Models Yet
            </h3>
            <p className="text-gray-600">
              Upload your first 3D model to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
