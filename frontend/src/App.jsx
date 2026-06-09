// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Battery, Briefcase, GraduationCap, Clock, MapPin, 
  Coffee, Zap, AlertCircle, StickyNote, Trash2, Quote
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [currentEnergy, setCurrentEnergy] = useState('alta');
  const [currentContext, setCurrentContext] = useState('casa');
  const [formData, setFormData] = useState({ title: '', category: 'trabalho', context: 'casa', energy_required: 'alta', duration_minutes: 30 });

  const quotes = [
    "O segredo da produtividade é focar no processo, não no tempo.",
    "Sua rotina de hoje constrói o seu sucesso de amanhã.",
    "Não estude até saber, estude até não conseguir esquecer.",
    "Pequenos blocos de tempo geram grandes resultados."
  ];
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  const fetchData = async () => {
    try {
      const resTasks = await axios.get(`${API_URL}/tasks`);
      const resNotes = await axios.get(`${API_URL}/notes`);
      setTasks(resTasks.data);
      setNotes(resNotes.data);
    } catch (err) {
      console.error("Erro ao buscar dados", err);
    }
  };

  useEffect(() => {fetchData(); }, []);

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/tasks`, formData);
    setFormData({ ...formData, title: '' });
    fetchData();
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if(!newNote.trim()) return;
    await axios.post(`${API_URL}/notes`, { content: newNote });
    setNewNote('');
    fetchData();
  };

  const deleteNote = async (id) => {
    await axios.delete(`${API_URL}/notes/${id}`);
    fetchData();
  };

  const getCategoryColor = (category) => {
    const colors = {
      trabalho: 'bg-blue-600 text-white shadow-blue-200',
      livre: 'bg-emerald-500 text-white shadow-emerald-200',
      prazo: 'bg-rose-500 text-white shadow-rose-200',
      reuniao: 'bg-amber-400 text-slate-900 shadow-amber-200'
    };
    return colors[category] || 'bg-white';
  };

  const recommendedTasks = tasks.filter(t => t.energy_required === currentEnergy && t.context === currentContext);

  return (
    <div className="min-h-screen bg-[#F4F7FA] text-slate-800 font-sans p-4 md:p-8">
      
      {/* TOP HEADER COM FRASE MOTIVADORA */}
      <header className="max-w-7xl mx-auto mb-12 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-blue-900 tracking-tighter">TIMEFLOW <span className="text-blue-500">PRO</span></h1>
          <div className="flex items-center gap-2 text-blue-600/70 font-medium mt-1 italic">
            <Quote size={16} /> <span>{quote}</span>
          </div>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-blue-100 flex items-center gap-4">
          <Clock className="text-blue-500 animate-pulse" size={20}/>
          <span className="font-bold text-blue-900">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ESQUERDA: FORMULÁRIO */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-white">
            <h2 className="text-lg font-black text-blue-900 mb-6 flex items-center gap-2">
              <Plus size={20} className="bg-blue-100 text-blue-600 rounded-lg" /> Criar Atividade
            </h2>
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <input 
                className="w-full bg-slate-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-blue-400 transition-all shadow-inner"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="O que planeja?" required
              />
              <select className="w-full bg-slate-50 border-none rounded-xl p-4" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="trabalho">🔵 Trabalho</option>
                <option value="livre">🟢 Tempo Livre</option>
                <option value="prazo">🔴 Prazo / Urgente</option>
                <option value="reuniao">🟡 Aula / Reunião</option>
              </select>
              <select className="w-full bg-slate-50 border-none rounded-xl p-4" value={formData.context} onChange={(e) => setFormData({...formData, context: e.target.value})}>
                <option value="casa">🏠 Em Casa</option>
                <option value="faculdade">🎓 Faculdade</option>
                <option value="trabalho">🏢 Trabalho</option>
                <option value="transito">🚌 Trânsito</option>
              </select>
              <button className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200">
                ADICIONAR BLOCO
              </button>
            </form>
          </div>

          {/* AGENDA / ANOTAÇÕES */}
          <div className="bg-blue-900 p-6 rounded-[2rem] text-white shadow-xl">
            <h2 className="text-lg font-black mb-4 flex items-center gap-2"><StickyNote size={20}/> Agenda Rápida</h2>
            <div className="mb-4">
               <textarea 
                className="w-full bg-blue-800 border-none rounded-xl p-3 text-sm text-white placeholder-blue-300 focus:ring-1 focus:ring-blue-400"
                placeholder="Escreva algo e aperte Enter..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleNoteSubmit(e);
                  }
                }}
               />
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {notes.map(n => (
                <div key={n.id} className="bg-blue-800/50 p-3 rounded-lg flex justify-between items-center group animate-in fade-in slide-in-from-left-2">
                  <p className="text-xs break-all">{n.content}</p>
                  <button onClick={() => deleteNote(n.id)} className="opacity-0 group-hover:opacity-100 text-blue-300 hover:text-red-400 transition ml-2 shrink-0">
                    <Trash2 size={14}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* CENTRO: SMART FILTERS */}
        <main className="lg:col-span-9 space-y-8">
          <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <h2 className="text-2xl font-black text-blue-900 flex items-center gap-2">
                  <Zap className="text-blue-500 fill-blue-500" /> Onde você está agora?
                </h2>
                <p className="text-slate-500 font-medium">Recomendaremos o melhor para o seu nível de energia.</p>
                <div className="flex flex-wrap gap-2 mt-6">
                  {['casa', 'faculdade', 'trabalho', 'transito'].map(c => (
                    <button 
                      key={c} onClick={() => setCurrentContext(c)}
                      className={`px-6 py-2 rounded-xl font-bold transition-all ${currentContext === c ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-blue-50'}`}
                    >
                      {c.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-slate-50 p-2 rounded-2xl flex gap-1">
                 <button onClick={() => setCurrentEnergy('alta')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${currentEnergy === 'alta' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>🔋 ALTA</button>
                 <button onClick={() => setCurrentEnergy('baixa')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${currentEnergy === 'baixa' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>🪫 BAIXA</button>
              </div>
            </div>
          </section>

          {/* CARDS DE TAREFAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {recommendedTasks.map(task => (
              <div key={task.id} className={`group p-6 rounded-[2rem] shadow-lg transition-all duration-300 hover:-translate-y-2 ${getCategoryColor(task.category)}`}>
                <div className="flex justify-between items-center mb-6">
                  <div className="p-2 bg-white/20 rounded-lg">
                    {task.category === 'trabalho' && <Briefcase size={20}/>}
                    {task.category === 'prazo' && <AlertCircle size={20}/>}
                    {task.category === 'livre' && <Coffee size={20}/>}
                    {task.category === 'reuniao' && <GraduationCap size={20}/>}
                  </div>
                  <span className="text-[10px] font-black bg-black/10 px-3 py-1 rounded-full uppercase tracking-tighter">{task.duration_minutes} MIN</span>
                </div>
                <h3 className="text-xl font-black mb-6 min-h-[3.5rem] leading-tight">{task.title}</h3>
                <div className="flex items-center gap-4 text-[10px] font-bold border-t border-white/20 pt-4">
                  <span className="flex items-center gap-1"><MapPin size={12}/> {task.context.toUpperCase()}</span>
                  <span className="flex items-center gap-1"><Battery size={12}/> {task.energy_required.toUpperCase()}</span>
                </div>
              </div>
            ))}

            {recommendedTasks.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="bg-white inline-block p-10 rounded-[3rem] border-4 border-dashed border-slate-100">
                   <p className="text-slate-400 font-bold text-lg">Tudo limpo por aqui! <br/> Que tal aproveitar para descansar ou planejar algo novo?</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;