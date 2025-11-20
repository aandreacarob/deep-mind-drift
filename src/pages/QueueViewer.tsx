import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import QueueClient, { QueueMessage, QueueStats } from "@/lib/queueClient";
import { CustomCursor } from "@/components/CustomCursor";

const QueueViewer = () => {
  const navigate = useNavigate();
  const [queueClient, setQueueClient] = useState<QueueClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState<QueueStats>({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
  });
  const [messages, setMessages] = useState<QueueMessage[]>([]);
  const [host, setHost] = useState(window.location.hostname);
  const [port, setPort] = useState(window.location.port || "8080");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      queueClient?.disconnect();
    };
  }, [queueClient]);

  const handleConnect = async () => {
    try {
      setError(null);
      const client = new QueueClient(host, parseInt(port), "ws");
      
      await client.connect(
        (data) => {
          // Manejar mensajes recibidos
          if (data.type === "stats") {
            setStats(data.stats);
          } else if (data.type === "message") {
            setMessages((prev) => [data.message, ...prev].slice(0, 50));
          }
        },
        (err) => {
          setError(err.message);
          setIsConnected(false);
        }
      );

      setQueueClient(client);
      setIsConnected(true);

      // Obtener estadísticas iniciales
      const initialStats = await client.getQueueStats();
      setStats(initialStats);

      // Obtener mensajes iniciales
      const initialMessages = await client.getQueueMessages();
      setMessages(initialMessages);

      // Actualizar estadísticas periódicamente
      const interval = setInterval(async () => {
        if (client.isConnected()) {
          const updatedStats = await client.getQueueStats();
          setStats(updatedStats);
        }
      }, 5000);

      return () => clearInterval(interval);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de conexión");
      setIsConnected(false);
    }
  };

  const handleDisconnect = () => {
    queueClient?.disconnect();
    setQueueClient(null);
    setIsConnected(false);
    setMessages([]);
    setStats({
      total: 0,
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
    });
  };

  return (
    <>
      <CustomCursor />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/")}
              className="mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              ← Volver
            </button>
            <h1 className="text-4xl font-bold text-white mb-2">Visualizador de Cola</h1>
            <p className="text-gray-300">Monitorea el estado de tu servicio de cola en tiempo real</p>
          </div>

          {/* Connection Panel */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-white text-sm font-medium mb-2">Host</label>
                <input
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  disabled={isConnected}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="localhost"
                />
              </div>
              <div className="flex-1">
                <label className="block text-white text-sm font-medium mb-2">Puerto</label>
                <input
                  type="text"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  disabled={isConnected}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="6379"
                />
              </div>
              <div>
                {!isConnected ? (
                  <button
                    onClick={handleConnect}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Conectar
                  </button>
                ) : (
                  <button
                    onClick={handleDisconnect}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Desconectar
                  </button>
                )}
              </div>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                {error}
              </div>
            )}
            {isConnected && (
              <div className="mt-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">Conectado</span>
              </div>
            )}
          </div>

          {/* Stats */}
          {isConnected && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <div className="text-gray-300 text-sm mb-2">Total</div>
                <div className="text-3xl font-bold text-white">{stats.total}</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30"
              >
                <div className="text-yellow-200 text-sm mb-2">Pendientes</div>
                <div className="text-3xl font-bold text-yellow-300">{stats.pending}</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-500/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30"
              >
                <div className="text-blue-200 text-sm mb-2">Procesando</div>
                <div className="text-3xl font-bold text-blue-300">{stats.processing}</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30"
              >
                <div className="text-green-200 text-sm mb-2">Completados</div>
                <div className="text-3xl font-bold text-green-300">{stats.completed}</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 backdrop-blur-sm rounded-xl p-6 border border-red-500/30"
              >
                <div className="text-red-200 text-sm mb-2">Fallidos</div>
                <div className="text-3xl font-bold text-red-300">{stats.failed}</div>
              </motion.div>
            </div>
          )}

          {/* Messages List */}
          {isConnected && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Mensajes Recientes</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-gray-400 text-center py-8">No hay mensajes</div>
                ) : (
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white/5 rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{message.id}</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            message.status === "completed"
                              ? "bg-green-500/20 text-green-300"
                              : message.status === "processing"
                              ? "bg-blue-500/20 text-blue-300"
                              : message.status === "failed"
                              ? "bg-red-500/20 text-red-300"
                              : "bg-yellow-500/20 text-yellow-300"
                          }`}
                        >
                          {message.status}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{message.content}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        {new Date(message.timestamp).toLocaleString()}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QueueViewer;

