import { useEffect, useMemo, useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import {
  Recycle, MapPin, Plus, Search, Leaf, Trash2, ExternalLink,
  Navigation, CheckCircle2, AlertCircle, PackageCheck, Menu, X
} from 'lucide-react';

const STORAGE_KEY = 'ecocycle-pontos-v1';
const tipos = [
  { id: 'Plástico', emoji: '🧴', cor: 'plastic', dica: 'Garrafas, embalagens e potes limpos' },
  { id: 'Papel', emoji: '📦', cor: 'paper', dica: 'Papelão, jornais e folhas' },
  { id: 'Vidro', emoji: '🍾', cor: 'glass', dica: 'Garrafas e potes de vidro' },
  { id: 'Metal', emoji: '🥫', cor: 'metal', dica: 'Latas de alumínio e aço' },
  { id: 'Orgânico', emoji: '🍃', cor: 'organic', dica: 'Restos de frutas e verduras' }
];

function lerPontos() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

export default function App() {
  const [pontos, setPontos] = useState(lerPontos);
  const [tipo, setTipo] = useState('Plástico');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('Todos');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [capturando, setCapturando] = useState(false);
  const [aba, setAba] = useState('pontos');
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(pontos)), [pontos]);

  const pontosFiltrados = useMemo(() => pontos.filter(p => {
    const texto = `${p.nome} ${p.tipo} ${p.descricao}`.toLowerCase();
    return texto.includes(busca.toLowerCase()) && (filtro === 'Todos' || p.tipo === filtro);
  }), [pontos, busca, filtro]);

  async function capturarLocalizacao() {
    setErro(''); setMensagem(''); setCapturando(true);
    try {
      let coords;
      try {
        const permissao = await Geolocation.checkPermissions();
        if (permissao.location === 'denied') await Geolocation.requestPermissions();
        const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 20000 });
        coords = pos.coords;
      } catch (capacitorError) {
        if (!navigator.geolocation) throw capacitorError;
        coords = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(
          position => resolve(position.coords), reject,
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
        ));
      }
      setLatitude(coords.latitude.toFixed(6));
      setLongitude(coords.longitude.toFixed(6));
      setMensagem('Localização capturada com sucesso!');
    } catch (e) {
      setErro('Não foi possível obter a localização. Verifique se o GPS está ativado e permita o acesso à localização.');
    } finally { setCapturando(false); }
  }

  function registrarPonto(e) {
    e.preventDefault(); setErro(''); setMensagem('');
    if (!nome.trim()) return setErro('Informe o nome do ponto de descarte.');
    if (latitude === '' || longitude === '') return setErro('Capture a localização antes de registrar.');
    const novo = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      nome: nome.trim(), tipo, descricao: descricao.trim(),
      latitude: Number(latitude), longitude: Number(longitude),
      criadoEm: new Date().toISOString()
    };
    setPontos(atual => [novo, ...atual]);
    setNome(''); setDescricao(''); setLatitude(''); setLongitude('');
    setMensagem('Ponto de descarte cadastrado com sucesso!'); setAba('pontos');
  }

  function excluirPonto(id) {
    if (window.confirm('Deseja excluir este ponto de descarte?')) setPontos(atual => atual.filter(p => p.id !== id));
  }

  const mapaUrl = (lat, lng) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuAberto ? 'open' : ''}`}>
        <div className="brand"><div className="brand-mark"><Recycle size={27}/></div><div><strong>Eco<span>Cycle</span></strong><small>RECICLAGEM COMUNITÁRIA</small></div><button className="close-menu" onClick={() => setMenuAberto(false)} aria-label="Fechar menu"><X/></button></div>
        <div className="side-label">MENU PRINCIPAL</div>
        <button className={`nav-link ${aba === 'pontos' ? 'active' : ''}`} onClick={() => {setAba('pontos');setMenuAberto(false)}}><MapPin size={19}/> Pontos de descarte</button>
        <button className={`nav-link ${aba === 'novo' ? 'active' : ''}`} onClick={() => {setAba('novo');setMensagem('');setErro('');setMenuAberto(false)}}><Plus size={19}/> Cadastrar ponto</button>
        <div className="sidebar-tip"><div className="tip-icon"><Leaf size={20}/></div><strong>Pequenas atitudes, grandes mudanças.</strong><p>Separe corretamente e ajude a transformar sua comunidade.</p></div>
        <div className="side-footer"><span className="status-dot"/> Projeto de sustentabilidade <b>v1.0</b></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><button className="mobile-menu" onClick={() => setMenuAberto(true)} aria-label="Abrir menu"><Menu/></button><div className="breadcrumb">EcoCycle <span>/</span> {aba === 'novo' ? 'Novo cadastro' : 'Painel comunitário'}</div><div className="topbar-right"><span className="online-dot"/> Ambiente local</div></header>

        <section className="welcome"><div><div className="eyebrow"><Leaf size={15}/> UM CICLO MELHOR COMEÇA AQUI</div><h1>Reciclar é cuidar<br className="desktop-break"/> do nosso <span>futuro.</span></h1><p>Encontre, cadastre e acompanhe pontos de descarte da sua comunidade.</p></div><div className="welcome-art"><div className="art-circle"><Recycle size={78}/><span>♻</span></div><div className="art-leaf leaf-one">✦</div><div className="art-leaf leaf-two">✦</div></div></section>

        <section className="stats-grid">
          <div className="stat-card"><div className="stat-icon green"><MapPin size={21}/></div><div><small>Pontos cadastrados</small><strong>{pontos.length}</strong><span>Na sua comunidade</span></div></div>
          <div className="stat-card"><div className="stat-icon lime"><Recycle size={21}/></div><div><small>Tipos de resíduos</small><strong>{new Set(pontos.map(p => p.tipo)).size}</strong><span>Materiais registrados</span></div></div>
          <div className="stat-card"><div className="stat-icon mint"><CheckCircle2 size={21}/></div><div><small>Organização</small><strong>{pontos.length ? 'Ativa' : 'Comece'}</strong><span>{pontos.length ? 'Cadastro em andamento' : 'Cadastre o primeiro ponto'}</span></div></div>
        </section>

        {mensagem && <div className="notice success"><CheckCircle2 size={18}/>{mensagem}<button onClick={() => setMensagem('')} aria-label="Fechar aviso"><X size={16}/></button></div>}
        {erro && <div className="notice error"><AlertCircle size={18}/>{erro}<button onClick={() => setErro('')} aria-label="Fechar aviso"><X size={16}/></button></div>}

        {aba === 'novo' ? (
          <section className="panel form-panel"><div className="panel-heading"><div><span className="section-kicker">CONTRIBUA COM A COMUNIDADE</span><h2>Cadastrar ponto de descarte</h2><p>Preencha as informações e marque a localização no mapa.</p></div><div className="heading-icon"><Plus/></div></div>
            <form onSubmit={registrarPonto}>
              <label className="field-label" htmlFor="nome">Nome do ponto <span>*</span></label><input id="nome" className="text-input" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex.: Ecoponto do Centro" maxLength={70}/>
              <div className="field-label material-label">Tipo de resíduo <span>*</span></div><div className="material-grid">{tipos.map(t => <button type="button" key={t.id} className={`material-option ${tipo === t.id ? 'selected' : ''}`} onClick={() => setTipo(t.id)}><span className="material-emoji">{t.emoji}</span><strong>{t.id}</strong><small>{t.dica}</small></button>)}</div>
              <label className="field-label" htmlFor="descricao">Descrição <small>(opcional)</small></label><textarea id="descricao" className="text-input textarea" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Referência, horário de funcionamento ou orientações..." rows="3" maxLength={240}/>
              <div className="field-label">Localização geográfica <span>*</span></div><div className="location-box"><div className="location-copy"><div className="location-pin"><Navigation size={19}/></div><div><strong>{latitude && longitude ? 'Localização definida' : 'Marque a localização atual'}</strong><small>{latitude && longitude ? `${latitude}, ${longitude}` : 'Permita o acesso ao GPS do dispositivo.'}</small></div></div><button type="button" className="outline-button" onClick={capturarLocalizacao} disabled={capturando}><MapPin size={17}/>{capturando ? 'Localizando...' : 'Usar meu GPS'}</button></div>
              <div className="coordinates"><div><label htmlFor="lat">Latitude</label><input id="lat" className="text-input" inputMode="decimal" value={latitude} onChange={e => setLatitude(e.target.value)} placeholder="Ex.: -23.550520"/></div><div><label htmlFor="lng">Longitude</label><input id="lng" className="text-input" inputMode="decimal" value={longitude} onChange={e => setLongitude(e.target.value)} placeholder="Ex.: -46.633308"/></div></div>
              <div className="form-actions"><button type="button" className="cancel-button" onClick={() => {setAba('pontos');setErro('');setMensagem('')}}>Cancelar</button><button type="submit" className="primary-button"><Plus size={18}/> Salvar ponto</button></div>
            </form>
          </section>
        ) : (
          <section className="panel"><div className="panel-heading list-heading"><div><span className="section-kicker">MAPEAMENTO COLABORATIVO</span><h2>Pontos da comunidade</h2><p>Locais de coleta registrados pelos participantes.</p></div><button className="primary-button" onClick={() => {setAba('novo');setMensagem('');setErro('')}}><Plus size={18}/> Novo ponto</button></div>
            <div className="toolbar"><div className="search-box"><Search size={18}/><input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por nome, material..."/></div><select className="filter-select" value={filtro} onChange={e => setFiltro(e.target.value)}><option>Todos</option>{tipos.map(t => <option key={t.id}>{t.id}</option>)}</select></div>
            {pontosFiltrados.length ? <div className="points-list">{pontosFiltrados.map(p => <article className="point-card" key={p.id}><div className={`point-material ${tipos.find(t => t.id === p.tipo)?.cor || 'green'}`}>{tipos.find(t => t.id === p.tipo)?.emoji || '♻'}</div><div className="point-info"><div className="point-title-row"><h3>{p.nome}</h3><span className="type-pill">{p.tipo}</span></div><p>{p.descricao || 'Ponto de descarte comunitário.'}</p><small><MapPin size={13}/> {p.latitude.toFixed(5)}, {p.longitude.toFixed(5)}</small></div><div className="point-actions"><a className="map-button" href={mapaUrl(p.latitude,p.longitude)} target="_blank" rel="noreferrer"><ExternalLink size={16}/> Ver mapa</a><button className="delete-button" onClick={() => excluirPonto(p.id)} aria-label={`Excluir ${p.nome}`}><Trash2 size={17}/></button></div></article>)}</div> : <div className="empty-state"><div className="empty-icon"><PackageCheck size={34}/></div><h3>{pontos.length ? 'Nenhum resultado encontrado' : 'Sua comunidade começa por aqui!'}</h3><p>{pontos.length ? 'Tente mudar a busca ou o filtro selecionado.' : 'Cadastre o primeiro ponto de descarte e ajude outras pessoas a reciclar corretamente.'}</p>{!pontos.length && <button className="primary-button" onClick={() => setAba('novo')}><Plus size={18}/> Cadastrar primeiro ponto</button>}</div>}
            <div className="list-footnote"><span><span className="status-dot"/> Dados salvos neste dispositivo</span><span>{pontosFiltrados.length} de {pontos.length} ponto(s)</span></div>
          </section>
        )}
        <footer className="page-footer"><span>© 2026 EcoCycle</span><span>Um futuro mais limpo depende de todos nós <Leaf size={14}/></span></footer>
      </main>
    </div>
  );
}
