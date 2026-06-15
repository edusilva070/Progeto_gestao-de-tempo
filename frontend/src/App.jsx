// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Battery, Briefcase, GraduationCap, Clock, MapPin, 
  Coffee, Zap, AlertCircle, StickyNote, Trash2, Quote, LogIn, UserPlus, Power
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {

  const [screen, setScreen] = useState('login'); 
  
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [currentEnergy, setCurrentEnergy] = useState('alta');
  const [currentContext, setCurrentContext] = useState('casa');
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [taskForm, setTaskForm] = useState({ title: '', category: 'trabalho', context: 'casa', energy_required: 'alta', duration_minutes: 30 });

  const [quote] = useState("Pequenos blocos de tempo focados superam longas horas de distração.");

  const fetchData = async () => {
    try {
      const resTasks = await axios.get(`${API_URL}/tasks`);
      const resNotes = await axios.get(`${API_URL}/notes`);
      setTasks(resTasks.data);
      setNotes(resNotes.data);
    } catch (err) {
      console.error("Erro ao conectar com a API do Backend", err);
    }
  };

  useEffect(() => { if (screen === 'dashboard') fetchData(); }, [screen]);

  const handleLogin = (e) => { e.preventDefault(); setScreen('dashboard'); };
  const handleRegister = (e) => { 
    e.preventDefault(); 
    if(registerForm.password !== registerForm.confirmPassword) return alert("As senhas não coincidem!");
    setScreen('dashboard'); 
  };

  // Handlers de Dados
  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/tasks`, taskForm);
    setTaskForm({ ...taskForm, title: '' });
    fetchData();
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
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
      trabalho: 'border-blue-500 bg-blue-500/10 text-blue-400',
      livre: 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
      prazo: 'border-rose-500 bg-rose-500/10 text-rose-400',
      reuniao: 'border-amber-400 bg-amber-400/10 text-amber-300'
    };
    return colors[category] || 'border-slate-700 bg-slate-800';
  };

  const recommendedTasks = tasks.filter(t => t.energy_required === currentEnergy && t.context === currentContext);


  if (screen === 'login') {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 p-8 md:p-10 rounded-[2rem] shadow-2xl z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tight text-white font-title">TIMEFLOW <span className="text-cyan-400">PRO</span></h1>
            <p class="text-slate-400 text-xs mt-1">Gestão de alta performance para estudante-trabalhador</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Endereço de E-mail</label>
              <input type="email" required className="w-full bg-[#020617] border border-slate-800 focus:border-cyan-500 text-white px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner" placeholder="seu-email@exemplo.com" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Sua Senha</label>
              <input type="password" required className="w-full bg-[#020617] border border-slate-800 focus:border-cyan-500 text-white px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner" placeholder="••••••••" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
            </div>
            <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-cyan-500/10 text-sm uppercase tracking-wider flex items-center justify-center gap-2">
              <LogIn size={18} /> Entrar no Painel
            </button>
          </form>
          <div className="mt-8 text-center border-t border-slate-800/60 pt-6">
            <p className="text-xs text-slate-400">Ainda não tem uma conta ativa?</p>
            <button onClick={() => setScreen('register')} className="mt-2 text-xs font-bold text-cyan-400 hover:underline">Criar Nova Conta Gratuitamente</button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'register') {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 p-8 md:p-10 rounded-[2rem] shadow-2xl z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tight text-white font-title">COMEÇAR <span class="text-cyan-400">AGORA</span></h1>
            <p class="text-slate-400 text-xs mt-1">Crie o seu perfil inteligente em poucos segundos</p>
          </div>
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Nome Completo</label>
              <input type="text" required className="w-full bg-[#020617] border border-slate-800 focus:border-cyan-500 text-white px-4 py-3 rounded-xl text-sm focus:outline-none" placeholder="Ex: João Silva" value={registerForm.name} onChange={e => setRegisterForm({...registerForm, name: e.target.value})} />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Seu Melhor E-mail</label>
              <input type="email" required className="w-full bg-[#020617] border border-slate-800 focus:border-cyan-500 text-white px-4 py-3 rounded-xl text-sm focus:outline-none" placeholder="nome@exemplo.com" value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})} />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Crie uma Senha</label>
              <input type="password" required className="w-full bg-[#020617] border border-slate-800 focus:border-cyan-500 text-white px-4 py-3 rounded-xl text-sm focus:outline-none" placeholder="••••••••" value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})} />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Confirme a sua Senha</label>
              <input type="password" required className="w-full bg-[#020617] border border-slate-800 focus:border-cyan-500 text-white px-4 py-3 rounded-xl text-sm focus:outline-none" placeholder="••••••••" value={registerForm.confirmPassword} onChange={e => setRegisterForm({...registerForm, confirmPassword: e.target.value})} />
            </div>
            <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold py-4 rounded-xl transition-all active:scale-[0.98] text-sm uppercase tracking-wider flex items-center justify-center gap-2">
              <UserPlus size={18}/> Concluir Cadastro
            </button>
          </form>
          <div className="mt-6 text-center border-t border-slate-800/60 pt-4">
            <p className="text-xs text-slate-400">Já possui uma conta?</p>
            <button onClick={() => setScreen('login')} className="mt-1 text-xs font-bold text-cyan-400 hover:underline">Fazer Login Direto</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans p-4 md:p-8">
      
      {/* HEADER DE TOPO */}
      <header className="max-w-[1600px] mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight font-title">TIMEFLOW <span className="text-cyan-400">PRO</span></h1>
          <p className="text-slate-400 text-xs font-medium">Painel de Foco Inteligente | Modo Escuro Ativo</p>
        </div>
        
        {/* Frase Motivadora Dinâmica */}
        <div className="hidden lg:flex items-center gap-2 bg-[#020617] px-4 py-2 rounded-xl border border-slate-800/80 max-w-md">
          <Quote size={14} className="text-cyan-400/50" />
          <span className="text-xs text-slate-300 font-medium italic">{quote}</span>
        </div>

        <div class="flex items-center gap-4">
          <span class="text-sm font-bold text-slate-300 bg-[#020617] px-4 py-2 rounded-xl border border-slate-800">
            <Clock size={14} className="inline mr-2 text-cyan-400" />{new Date().toLocaleDateString('pt-BR')}
          </span>
          <button onClick={() => setScreen('login')} className="p-2.5 bg-slate-800 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl transition text-slate-400">
            <Power size={16} />
          </button>
        </div>
      </header>

      {/* GRID DE 3 COLUNAS DISTRIBUÍDO */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUNA 1: ADICIONAR BLOCOS (Esquerda - 3 Colunas) */}
        <aside className="lg:col-span-3 bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-lg">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <PlusCircle size={18} className="text-cyan-400" /> Criar Bloco de Tempo
          </h2>
          <form onSubmit={handleTaskSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Título</label>
              <input type="text" required class="w-full bg-[#020617] border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition" placeholder="Ex: Revisar matéria" value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Categoria</label>
                <select class="w-full bg-[#020617] border border-slate-800 rounded-xl p-3 text-sm text-slate-300" value={taskForm.category} onChange={e => setTaskForm({...taskForm, category: e.target.value})}>
                  <option value="trabalho">🔵 Trabalho</option>
                  <option value="livre">🟢 Livre</option>
                  <option value="prazo">🔴 Urgente</option>
                  <option value="reuniao">🟡 Aula</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Minutos</label>
                <input type="number" class="w-full bg-[#020617] border border-slate-800 rounded-xl p-3 text-sm text-white" value={taskForm.duration_minutes} onChange={e => setTaskForm({...taskForm, duration_minutes: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Contexto</label>
                <select class="w-full bg-[#020617] border border-slate-800 rounded-xl p-3 text-sm text-slate-300" value={taskForm.context} onChange={e => setTaskForm({...taskForm, context: e.target.value})}>
                  <option value="casa">🏠 Casa</option>
                  <option value="faculdade">🎓 Faculdade</option>
                  <option value="trabalho">🏢 Trabalho</option>
                  <option value="transito">🚌 Trânsito</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Energia</label>
                <select class="w-full bg-[#020617] border border-slate-800 rounded-xl p-3 text-sm text-slate-300" value={taskForm.energy_required} onChange={e => setTaskForm({...taskForm, energy_required: e.target.value})}>
                  <option value="alta">⚡ Alta</option>
                  <option value="baixa">🔋 Baixa</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold py-3 rounded-xl transition text-sm uppercase tracking-wider active:scale-95">Salvar Atividade</button>
          </form>
        </aside>

        {/* COLUNA 2: FILTROS INTELIGENTES E CARDS (Centro - 6 Colunas) */}
        <section className="lg:col-span-6 space-y-6">
          <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-lg">
            <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Zap size={18} className="text-cyan-400" /> Filtro de Realidade Atual
            </h2>
            <div className="flex flex-wrap gap-3 items-center justify-between border-t border-slate-800/60 pt-4">
              <div className="flex gap-2">
                {['casa', 'faculdade', 'trabalho', 'transito'].map(c => (
                  <button key={c} onClick={() => setCurrentContext(c)} className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition ${currentContext === c ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'bg-[#020617] text-slate-400 hover:text-white'}`}>{c}</button>
                ))}
              </div>
              <div className="flex bg-[#020617] p-1 rounded-lg border border-slate-800">
                <button onClick={() => setCurrentEnergy('alta')} className={`px-3 py-1 text-xs font-bold rounded-md transition ${currentEnergy === 'alta' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500'}`}>⚡ ALTA</button>
                <button onClick={() => setCurrentEnergy('baixa')} className={`px-3 py-1 text-xs font-bold rounded-md transition ${currentEnergy === 'baixa' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500'}`}>🔋 BAIXA</button>
              </div>
            </div>
          </div>

          {/* LISTAGEM DOS CARDS DE ATIVIDADE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedTasks.map(task => (
              <div key={task.id} className={`bg-[#0f172a] p-5 rounded-xl border-l-[6px] shadow border-y border-r border-slate-800 hover:-translate-y-1 transition-all duration-300 ${getCategoryColor(task.category)}`}>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/20">{task.category}</span>
                  <span className="text-xs font-bold text-slate-400 bg-[#020617] px-2 py-0.5 rounded-md">{task.duration_minutes} min</span>
                </div>
                <h3 className="text-base font-bold text-white mb-4 line-clamp-2">{task.title}</h3>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 border-t border-slate-800/50 pt-3 font-semibold">
                  <span className="flex items-center gap-1"><MapPin size={12}/> {task.context.toUpperCase()}</span>
                  <span className="flex items-center gap-1"><Battery size={12}/> {task.energy_required.toUpperCase()}</span>
                </div>
              </div>
            ))}
            {recommendedTasks.length === 0 && (
              <div className="col-span-full py-16 text-center bg-[#0f172a] rounded-2xl border-2 border-dashed border-slate-800">
                <p className="font-medium text-slate-500 text-sm">Nenhum bloco agendado para o momento.<br/>Filtre outro cenário ou crie uma nova atividade!</p>
              </div>
            )}
          </div>
        </section>

        {/* COLUNA 3: AGENDA RÁPIDA (Direita - 3 Colunas) */}
        <aside className="lg:col-span-3 bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-lg">
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <StickyNote size={18} className="text-cyan-400" /> Agenda Rápida
          </h2>
          <form onSubmit={handleNoteSubmit} className="mb-4">
            <textarea 
              className="w-full bg-[#020617] border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 min-h-[80px] resize-none" 
              placeholder="Anotar lembrete rápido..."
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleNoteSubmit(e)}
            />
          </form>
          
          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
            {notes.map(note => (
              <div key={note.id} className="bg-[#020617] p-3 rounded-lg border border-slate-800 flex justify-between items-start gap-2 group animate-fadeIn">
                <p className="text-xs text-slate-300 leading-relaxed">{note.content}</p>
                <button onClick={() => deleteNote(note.id)} className="text-slate-600 hover:text-rose-400 transition opacity-0 group-hover:opacity-100 p-1">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
}

export default App;