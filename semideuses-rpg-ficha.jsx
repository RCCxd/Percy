import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Sword, Shield, Sparkles, Heart, Droplets, BookOpen, Users, ScrollText,
  Backpack, Save, Plus, Trash2, ChevronLeft, Dices, User, Feather, Star,
  Skull, Zap, Crown, Compass, Menu, X, Check, Loader2, Flame, Wand2,
  Scroll, Coins, Languages, Eye, PlusCircle, Trash
} from "lucide-react";

/* ============================================================
   DADOS DO SISTEMA — Semideuses RPG, 3ª Edição
   ============================================================ */

const ATTRS = [
  { key: "for", label: "Força", abbr: "FOR" },
  { key: "des", label: "Destreza", abbr: "DES" },
  { key: "con", label: "Constituição", abbr: "CON" },
  { key: "int", label: "Inteligência", abbr: "INT" },
  { key: "sab", label: "Sabedoria", abbr: "SAB" },
  { key: "car", label: "Carisma", abbr: "CAR" },
];
const ATTR_MAP = Object.fromEntries(ATTRS.map((a) => [a.key, a]));

const SKILLS = [
  { name: "Atletismo", attr: "for" },
  { name: "Acrobacia", attr: "des" },
  { name: "Furtividade", attr: "des" },
  { name: "Prestidigitação", attr: "des" },
  { name: "Saber Mítico", attr: "int" },
  { name: "História", attr: "int" },
  { name: "Investigação", attr: "int" },
  { name: "Natureza", attr: "int" },
  { name: "Religião", attr: "int" },
  { name: "Intuição", attr: "sab" },
  { name: "Lidar com Animais", attr: "sab" },
  { name: "Medicina", attr: "sab" },
  { name: "Percepção", attr: "sab" },
  { name: "Sobrevivência", attr: "sab" },
  { name: "Atuação", attr: "car" },
  { name: "Enganação", attr: "car" },
  { name: "Intimidação", attr: "car" },
  { name: "Persuasão", attr: "car" },
];

const BACKGROUNDS = [
  "Atleta", "Órfão de Rua", "Estudante Prodígio", "Filho de Família Rica",
  "Imigrante", "Artista", "Criminoso", "Criança Soldado", "Culto Familiar",
  "Sobrevivente", "Outro (personalizado)",
];

const ORIGINS = [
  "Semideus Grego", "Semideus Romano (Legionário)", "Sátiro / Fauno",
  "Ciclope", "Mortal Vidente", "Legado", "Caçadora de Ártemis (Voto)",
];

// Deuses maiores + menores — dados essenciais resumidos e parafraseados
// a partir do Livro do Jogador (capítulo "As Filiações — os 26 Deuses").
const GODS = [
  { id: "zeus", name: "Zeus", group: "maior", epithet: "O Senhor do Raio", domain: "Céu, raios e autoridade", playstyle: "Dano bruto corpo a corpo e à distância", conj: "car", hitDie: 10, saves: ["des", "car"], skills: ["Intimidação", "Persuasão", "História"], weapons: "Simples e marciais", armor: "Médias, leves e escudos", dom: "É imune a dano Elétrico e começa cada combate com Cargas extra ao ar livre, em altura ou em meio a uma tempestade.", sig: { name: "Tempestade Crescente", text: "Acumula Cargas a cada turno em combate; várias habilidades consomem Cargas para crescer em dano e alcance." } },
  { id: "poseidon", name: "Poseidon", group: "maior", epithet: "O Senhor das Marés", domain: "Mar, terremotos e cavalos", playstyle: "Controle de campo e mobilidade", conj: "sab", hitDie: 10, saves: ["for", "con"], skills: ["Atletismo", "Natureza", "Lidar com Animais"], weapons: "Simples e marciais", armor: "Médias, leves e escudos", dom: "Respira e enxerga normalmente debaixo d'água e nada à velocidade normal sem penalidade para agir.", sig: { name: "Maré", text: "Mantém um marcador que oscila entre Maré Alta e Maré Baixa; a maioria das habilidades muda de efeito conforme a maré atual." } },
  { id: "hades", name: "Hades", group: "maior", epithet: "O Senhor do Érebo", domain: "Morte, sombras e riquezas", playstyle: "Atrito: invocação e dreno", conj: "car", hitDie: 8, saves: ["int", "car"], skills: ["Religião", "Intimidação", "Furtividade"], weapons: "Simples e marciais", armor: "Médias e leves", dom: "Resistente a dano Necrótico, enxerga e conversa com espíritos e percebe quando alguém próximo está à beira da morte.", sig: { name: "Almas", text: "Ganha fichas de Alma quando um inimigo morre perto de você; gasta-as para reforçar invocações, converter dano em cura ou estender maldições." } },
  { id: "atena", name: "Atena", group: "maior", epithet: "A Comandante", domain: "Sabedoria e estratégia", playstyle: "Comando e suporte tático", conj: "int", hitDie: 8, saves: ["int", "sab"], skills: ["História", "Investigação", "Saber Mítico"], weapons: "Simples e marciais", armor: "Médias, leves e escudos", dom: "Lê a batalha com antecedência: tem Especialização numa perícia tática e, uma vez por combate, rola Iniciativa com Vantagem, podendo trocar de posição na ordem.", sig: { name: "Plano de Batalha", text: "Um pool de Comando cresce ao longo do combate e é gasto para conceder movimento, ações ou bônus táticos aos aliados." } },
  { id: "ares", name: "Ares", group: "maior", epithet: "O Duelista Bruto", domain: "Guerra e violência", playstyle: "Duelista bruto e resistente", conj: "for", hitDie: 12, saves: ["for", "con"], skills: ["Atletismo", "Intimidação", "Sobrevivência"], weapons: "Simples e marciais", armor: "Pesadas, médias, leves e escudos", dom: "Luta com qualquer arma como se tivesse nascido com ela: pode atacar com Vantagem em troca de dar Vantagem aos ataques contra si até o próximo turno.", sig: { name: "Fúria", text: "Um medidor de Fúria de 0 a 10 sobe ao sofrer dano ou acertar críticos, e é gasto livremente para potencializar golpes." } },
  { id: "apolo", name: "Apolo", group: "maior", epithet: "O Curandeiro-Arqueiro", domain: "Sol, música, profecia e cura", playstyle: "Curandeiro-arqueiro à distância", conj: "sab", hitDie: 8, saves: ["des", "sab"], skills: ["Medicina", "Atuação", "Religião"], weapons: "Simples e arcos", armor: "Leves", dom: "Suas flechas acertam por Destreza em vez de Sabedoria, e você emana um brilho que revela criaturas ocultas ou invisíveis por perto.", sig: { name: "Marca Solar", text: "Flechas marcam o alvo com luz por 1 minuto; aliados causam dano extra contra alvos marcados e curas podem saltar entre eles." } },
  { id: "hefesto", name: "Hefesto", group: "maior", epithet: "A Fortaleza", domain: "Fogo, forja e invenção", playstyle: "Fortaleza: CA, constructos e fogo", conj: "int", hitDie: 10, saves: ["for", "con"], skills: ["Investigação", "Percepção", "Atletismo"], weapons: "Simples e marciais", armor: "Pesadas, médias, leves e escudos", dom: "Imune ao fogo da própria forja, conserta objetos em metade do tempo e enxerga pontos fracos estruturais em objetos e constructos.", sig: { name: "Dispositivos", text: "Um orçamento de Pontos de Máquina financia torretas, autômatos e barreiras de bronze que agem sozinhos em combate." } },
  { id: "hermes", name: "Hermes", group: "maior", epithet: "O Velocista", domain: "Viagem, ladinagem e comércio", playstyle: "Velocista furtivo e versátil", conj: "car", hitDie: 8, saves: ["des", "int"], skills: ["Prestidigitação", "Enganação", "Persuasão"], weapons: "Simples e marciais leves", armor: "Médias e leves", dom: "Sua velocidade aumenta, ignora terreno difícil, nunca é surpreendido e tem Especialização em Prestidigitação ou Acrobacia.", sig: { name: "Ritmo", text: "Fichas de Ritmo alimentam deslocamentos extras, trocas de posição e um avanço rápido para o grupo inteiro." } },
  { id: "afrodite", name: "Afrodite", group: "maior", epithet: "O Controle do Coração", domain: "Amor, beleza e manipulação", playstyle: "Controlador social", conj: "car", hitDie: 6, saves: ["sab", "car"], skills: ["Persuasão", "Enganação", "Intuição"], weapons: "Simples", armor: "Leves", dom: "Tem Vantagem em testes sociais e, uma vez por cena, Enfeitiça de graça um alvo que falhe num Teste de Resistência de Sabedoria.", sig: { name: "Encanto", text: "Fichas de Encanto crescem quando um inimigo falha um teste contra você e alimentam habilidades de fascínio e domínio." } },
  { id: "demeter", name: "Deméter", group: "maior", epithet: "A Senhora do Campo", domain: "Colheita e natureza", playstyle: "Controle de terreno e cura", conj: "sab", hitDie: 8, saves: ["con", "sab"], skills: ["Natureza", "Sobrevivência", "Medicina"], weapons: "Simples e marciais", armor: "Médias e leves", dom: "Cria comida e água, ignora terreno difícil de plantas e sente tudo que toca o solo a distância.", sig: { name: "Crescimento", text: "Zonas de plantas criadas por você persistem e se espalham a cada turno, virando terreno difícil, cobertura e cura contínua." } },
  { id: "dionisio", name: "Dionísio", group: "maior", epithet: "O Caos", domain: "Vinho, loucura e êxtase", playstyle: "Conjurador de controle, caos e debilitação", conj: "car", hitDie: 6, saves: ["con", "car"], skills: ["Atuação", "Enganação", "Persuasão"], weapons: "Simples", armor: "Leves", dom: "Imune a veneno e à loucura, sente as emoções alheias e tem resistência a controle mental.", sig: { name: "Delírio", text: "Várias habilidades consultam uma pequena tabela de efeitos de Loucura (confusão, euforia, pânico ou frenesi), parte escolhida e parte sorteada." } },
  { id: "artemis", name: "Ártemis (Voto)", group: "maior", epithet: "O Voto da Caça", domain: "Devoção, caça e lua", playstyle: "Arqueira de matilha — regras especiais de Voto", conj: "sab", hitDie: 8, saves: ["des", "sab"], skills: ["Sobrevivência", "Furtividade", "Lidar com Animais"], weapons: "Simples e arcos", armor: "Leves", dom: "Segue as regras próprias do Voto de Ártemis (mortais juramentadas à deusa, não filhas biológicas) — consulte o capítulo de Filiações para os detalhes completos.", sig: { name: "Presa Marcada", text: "Marca uma presa por vez; você e eventuais Caçadoras espectrais concentram fogo nela, com dano extra e flanqueamento automático." } },
  { id: "hecate", name: "Hécate", group: "menor", epithet: "A Conjuradora Flexível", domain: "Magia, Névoa e encruzilhadas", playstyle: "Conjuradora flexível", conj: "int", hitDie: 6, saves: ["int", "sab"], skills: ["Saber Mítico", "Religião", "Investigação"], weapons: "Simples", armor: "Leves", dom: "Manipula a Névoa com Vantagem, conhece uma Skill adicional de qualquer fonte e conjura uma pequena ilusão à vontade.", sig: { name: "Pontos de Feitiço", text: "Um pool que se regenera no descanso é gasto para moldar magias na hora: mais alvos, mais área, duração dobrada ou tipo de dano trocado." } },
  { id: "iris", name: "Íris", group: "menor", epithet: "O Suporte que Muda de Cor", domain: "Luz, arco-íris e mensagens", playstyle: "Suporte modal de luz", conj: "car", hitDie: 6, saves: ["des", "car"], skills: ["Persuasão", "Percepção", "Atuação"], weapons: "Simples", armor: "Leves", dom: "Envia mensagens à vontade, vê através de ilusões e nunca se perde à luz do dia.", sig: { name: "Espectro", text: "No início do turno sintoniza uma cor — Dourado (cura), Vermelho (dano/ofuscar) ou Azul (mobilidade/escudo) — que muda o efeito das habilidades." } },
  { id: "nemesis", name: "Nêmesis", group: "menor", epithet: "A Vingança como Recurso", domain: "Vingança e equilíbrio", playstyle: "Vingadora de atrito", conj: "sab", hitDie: 8, saves: ["sab", "car"], skills: ["Intuição", "Intimidação", "Investigação"], weapons: "Simples e marciais", armor: "Médias e leves", dom: "Quando alguém acerta um crítico contra você ou o reduz à metade dos PV, você marca essa criatura com Vantagem e dano extra no próximo ataque.", sig: { name: "Dívida", text: "Ganha fichas de Dívida ao sofrer dano ou perder um aliado; gasta-as para amplificar retribuições e reflexos de dano." } },
  { id: "hipnos", name: "Hipnos", group: "menor", epithet: "O Torpor que se Acumula", domain: "Sono e torpor", playstyle: "Controle por sono", conj: "sab", hitDie: 6, saves: ["int", "sab"], skills: ["Medicina", "Intuição", "Furtividade"], weapons: "Simples", armor: "Leves", dom: "Imune à Exaustão por falta de sono e se recupera com mais facilidade ao concluir um descanso.", sig: { name: "Sonolência", text: "Habilidades aplicam fichas de Sonolência; ao acumular três, o alvo cai Inconsciente até sofrer dano." } },
  { id: "morfeu", name: "Morfeu", group: "menor", epithet: "Os Fios do Sonho", domain: "Sonhos e ilusões", playstyle: "Controle ilusório", conj: "car", hitDie: 6, saves: ["int", "car"], skills: ["Atuação", "Enganação", "Intuição"], weapons: "Simples", armor: "Leves", dom: "Ao dormir, entra no sonho de alguém que conhece e conjura uma ilusão do tamanho de um cômodo à vontade.", sig: { name: "Fios de Sonho", text: "Marca a mente de um alvo com um Fio; efeitos de sonho e pesadelo duram mais e atingem com mais força quem carrega o Fio." } },
  { id: "nike", name: "Nike", group: "menor", epithet: "O Ímpeto do Grupo", domain: "Vitória e ímpeto", playstyle: "Suporte de momentum", conj: "car", hitDie: 8, saves: ["for", "car"], skills: ["Atletismo", "Persuasão", "Intimidação"], weapons: "Simples e marciais", armor: "Médias e leves", dom: "Você e aliados próximos têm Vantagem em Testes de Resistência contra medo, e uma vez por turno concede dano extra quando um aliado acerta um ataque.", sig: { name: "Ímpeto", text: "O grupo acumula Ímpeto ao abater inimigos ou acertar críticos, gasto para conceder ações, movimento ou dano extra aos aliados." } },
  { id: "tique", name: "Tique", group: "menor", epithet: "A Sorte que Circula", domain: "Sorte e acaso", playstyle: "Sorte coletiva", conj: "car", hitDie: 8, saves: ["des", "car"], skills: ["Prestidigitação", "Enganação", "Percepção"], weapons: "Simples", armor: "Leves", dom: "Tem Pontos de Sorte iguais ao modificador de Conjuração, gastos para rerrolar um d20 — seu ou de um aliado próximo — e usar o melhor resultado.", sig: { name: "Dados de Sorte", text: "Suas habilidades criam Dados de Sorte (role duas vezes, use o melhor) para aliados e Dados de Azar (role duas vezes, use o pior) para inimigos." } },
  { id: "tanatos", name: "Tânatos", group: "menor", epithet: "O Executor Paciente", domain: "Morte gentil", playstyle: "Executor", conj: "sab", hitDie: 8, saves: ["con", "sab"], skills: ["Medicina", "Religião", "Intuição"], weapons: "Simples e marciais", armor: "Médias e leves", dom: "Vê quem está perto do fim (PV abaixo de 25%) e tem Vantagem em ataques contra eles; imune ao medo de mortos-vivos e enxerga espíritos.", sig: { name: "Marca da Morte", text: "Marca um alvo à vontade; se ele cair a 25% dos PV ou menos, a marca detona causando dano necrótico severo ou reduzindo-o a 0 PV." } },
  { id: "eolo", name: "Éolo", group: "menor", epithet: "O Vento que Você Pilota", domain: "Ventos e ar", playstyle: "Controle de zona (vento)", conj: "des", hitDie: 8, saves: ["des", "con"], skills: ["Acrobacia", "Percepção", "Sobrevivência"], weapons: "Simples", armor: "Leves", dom: "Velocidade aumentada, ignora terreno difícil de vento, areia ou neve, e cai de qualquer altura sem dano, pousando de pé.", sig: { name: "Ventania", text: "Mantém uma esfera de vento móvel de 6 m onde pode empurrar inimigos, desviar projéteis ou dar mobilidade a aliados." } },
  { id: "circe", name: "Circe", group: "menor", epithet: "A Transmutadora com Reagentes", domain: "Feitiço e transformação", playstyle: "Transmutadora com reagentes", conj: "int", hitDie: 6, saves: ["int", "car"], skills: ["Natureza", "Saber Mítico", "Medicina"], weapons: "Simples", armor: "Leves", dom: "Especialização em Medicina ou Natureza, prepara uma poção menor extra por Descanso Longo e animais comuns raramente a atacam.", sig: { name: "Reagentes", text: "Prepara Reagentes no descanso — poções, pós e frascos — usados em combate sem custo de MP para cura, veneno ou transformação." } },
  { id: "persefone", name: "Perséfone", group: "menor", epithet: "A Rainha das Duas Posturas", domain: "Primavera e Submundo", playstyle: "Híbrido de cura e morte", conj: "sab", hitDie: 8, saves: ["con", "sab"], skills: ["Natureza", "Religião", "Intuição"], weapons: "Simples e marciais", armor: "Médias e leves", dom: "Ignora terreno difícil de plantas, é resistente a dano Necrótico e, uma vez por Descanso Curto, cura um aliado ao fazer uma flor brotar.", sig: { name: "Estação", text: "Alterna entre Primavera (cura e crescimento) e Inverno (dano necrótico e controle); a mesma habilidade produz efeitos opostos conforme a postura." } },
  { id: "hebe", name: "Hebe", group: "menor", epithet: "A Copeira da Juventude", domain: "Juventude e vigor", playstyle: "Sustentação pura (Vigor)", conj: "con", hitDie: 8, saves: ["con", "car"], skills: ["Atletismo", "Acrobacia", "Persuasão"], weapons: "Simples e marciais", armor: "Médias e leves", resource: "Vigor", dom: "Vantagem em Testes de Resistência de Constituição, os Dados de Vida curam o máximo no Descanso Curto e, uma vez por Descanso Longo, se levanta com PV ao cair a 0.", sig: { name: "Vigor", text: "Não usa Mana: um pool de Vigor recuperado no descanso é gasto livremente, como Ação Bônus, para curar e sustentar o grupo." } },
  { id: "eros", name: "Eros", group: "menor", epithet: "O Senhor dos Laços", domain: "Desejo e vínculos", playstyle: "Manipulador de laços", conj: "car", hitDie: 6, saves: ["sab", "car"], skills: ["Intuição", "Atuação", "Furtividade"], weapons: "Simples e arcos", armor: "Leves", dom: "Especialização numa perícia social e, uma vez por cena, Enfeitiça de graça um alvo que falhe num Teste de Resistência de Sabedoria.", sig: { name: "Vínculos", text: "Cria ligações entre duas criaturas — aliadas ou inimigas — que compartilham dano, redirecionam ataques ou impedem que se ajudem." } },
  { id: "nyx", name: "Nyx", group: "menor", epithet: "A Controladora das Trevas", domain: "Noite, trevas e medo", playstyle: "Controladora das trevas", conj: "car", hitDie: 8, saves: ["sab", "car"], skills: ["Furtividade", "Intimidação", "Saber Mítico"], weapons: "Simples", armor: "Leves", dom: "Enxerga na escuridão (inclusive mágica), tem Camuflagem na penumbra e a primeira habilidade de cada combate no escuro custa menos Mana.", sig: { name: "Escuridão", text: "Cria e move zonas de escuridão mágica onde apenas você e aliados enxergam; suas habilidades ficam mais fortes contra quem está dentro." } },
];
const GOD_MAP = Object.fromEntries(GODS.map((g) => [g.id, g]));

const TABS = [
  { key: "identidade", label: "Identidade", icon: User },
  { key: "atributos", label: "Atributos", icon: Compass },
  { key: "pericias", label: "Perícias & TR", icon: ScrollText },
  { key: "combate", label: "Combate", icon: Sword },
  { key: "poderes", label: "Poderes Divinos", icon: Sparkles },
  { key: "talentos", label: "Talentos", icon: Star },
  { key: "equipamento", label: "Equipamento", icon: Backpack },
  { key: "personalidade", label: "Personalidade", icon: Feather },
];

/* ============================================================
   HELPERS
   ============================================================ */

const mod = (score) => Math.floor(((Number(score) || 0) - 10) / 2);
const fmtMod = (m) => (m >= 0 ? `+${m}` : `${m}`);
const profBonus = (nivel) => {
  const n = Number(nivel) || 1;
  if (n <= 4) return 2;
  if (n <= 8) return 3;
  if (n <= 12) return 4;
  if (n <= 16) return 5;
  return 6;
};
const DIE_AVG = { 6: 4, 8: 5, 10: 6, 12: 7 };
const pvMax = (die, nivel, conMod) => {
  const n = Math.max(1, Number(nivel) || 1);
  if (!die) return 0;
  let total = die + conMod;
  for (let i = 2; i <= n; i++) total += (DIE_AVG[die] || 0) + conMod;
  return Math.max(total, n);
};
const mpMax = (conjMod, nivel, isVigor) => {
  const n = Math.max(1, Number(nivel) || 1);
  if (isVigor) return 2 * n;
  let total = 6 + conjMod;
  for (let i = 2; i <= n; i++) total += 2 + conjMod;
  return Math.max(total, 0);
};
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

function emptyHero() {
  return {
    id: uid(),
    updatedAt: Date.now(),
    nome: "",
    jogador: "",
    origem: ORIGINS[0],
    filiacaoId: "",
    antecedente: "",
    antecedenteCustom: "",
    caminhoNome: "",
    nivel: 1,
    velocidade: 6,
    atributos: { for: 15, des: 14, con: 13, int: 12, sab: 10, car: 8 },
    periciasProf: {},
    trProf: { for: false, des: false, con: false, int: false, sab: false, car: false },
    pvAtual: null,
    pvTemp: 0,
    pvMaxManual: null,
    mpAtual: null,
    mpMaxManual: null,
    ca: { modo: "sem", base: 10, escudo: false },
    iniciativaExtra: 0,
    favor: 1,
    testesMorte: { sucessos: 0, falhas: 0 },
    dadosDeVidaGastos: 0,
    assinaturaTexto: "",
    bencaos: ["", ""],
    ataques: [],
    profArmas: "",
    profArmaduras: "",
    profFerramentas: "",
    idiomas: "",
    dracmas: 0,
    habilidadesRaca: [],
    habilidadesFiliacao: [],
    habilidadesCaminho: [],
    skillsSistema: [],
    talentos: [],
    reliquias: [],
    equipamento: [],
    personalidade: { traco: "", ideal: "", vinculo: "", falha: "" },
    aparencia: "",
    historia: "",
    notas: "",
  };
}

/* ---------- Persistência (window.storage) ---------- */
async function safeGet(key) {
  try {
    const r = await window.storage.get(key, false);
    return r ? r.value : null;
  } catch (e) {
    return null;
  }
}
async function safeSet(key, value) {
  try {
    await window.storage.set(key, value, false);
    return true;
  } catch (e) {
    return false;
  }
}
async function safeDelete(key) {
  try {
    await window.storage.delete(key, false);
  } catch (e) {
    /* ignore */
  }
}
async function loadIndex() {
  const raw = await safeGet("hero-index");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
async function saveIndex(list) {
  await safeSet("hero-index", JSON.stringify(list));
}
async function loadHero(id) {
  const raw = await safeGet("hero:" + id);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
async function saveHeroRemote(hero) {
  await safeSet("hero:" + hero.id, JSON.stringify(hero));
}
async function deleteHeroRemote(id) {
  await safeDelete("hero:" + id);
}

/* ============================================================
   SUBCOMPONENTES
   ============================================================ */

function Medallion({ label, abbr, score, onScore, modVal, prof, onProf, onRoll }) {
  return (
    <div className="medallion">
      <button type="button" className="roll-dot" onClick={() => onRoll(`${label}`, modVal)} title={`Rolar teste de ${label}`}>
        <Dices size={13} />
      </button>
      <div className="medallion-ring">
        <div className="medallion-mod">{fmtMod(modVal)}</div>
      </div>
      <div className="medallion-abbr">{abbr}</div>
      <input
        className="medallion-score"
        type="number"
        min={1}
        max={30}
        value={score}
        onChange={(e) => onScore(Number(e.target.value))}
      />
      <label className="medallion-prof">
        <input type="checkbox" checked={!!prof} onChange={(e) => onProf(e.target.checked)} />
        <span>TR proficiente</span>
      </label>
      <div className="medallion-label">{label}</div>
    </div>
  );
}

function colStyle(c) {
  if (typeof c.flex === "number") return { flex: c.flex };
  if (typeof c.flex === "string") return { width: c.flex, flexShrink: 0 };
  return { flex: 1 };
}

function EditableList({ title, icon, rows, columns, onChange, addLabel = "Adicionar", hint }) {
  const update = (idx, key, val) => {
    const next = rows.map((r, i) => (i === idx ? { ...r, [key]: val } : r));
    onChange(next);
  };
  const remove = (idx) => onChange(rows.filter((_, i) => i !== idx));
  const add = () => {
    const empty = { _id: uid() };
    columns.forEach((c) => (empty[c.key] = ""));
    onChange([...rows, empty]);
  };
  return (
    <div className="elist">
      <div className="elist-head">
        <div className="elist-head-title">
          {icon}
          <h4>{title}</h4>
        </div>
        <button type="button" className="btn-ghost small" onClick={add}>
          <Plus size={14} /> {addLabel}
        </button>
      </div>
      {hint && <p className="elist-hint">{hint}</p>}
      <div className="elist-table">
        <div className="elist-row elist-row-head">
          {columns.map((c) => (
            <div key={c.key} className="elist-cell" style={colStyle(c)}>
              {c.label}
            </div>
          ))}
          <div className="elist-cell elist-actions-head" style={{ width: 36, flexShrink: 0 }} />
        </div>
        {rows.length === 0 && (
          <div className="elist-empty">Nenhum item ainda. Consulte o Livro do Jogador e adicione aqui.</div>
        )}
        {rows.map((row, idx) => (
          <div className="elist-row" key={row._id || idx}>
            {columns.map((c) => (
              <div key={c.key} className="elist-cell" style={colStyle(c)}>
                {c.type === "textarea" ? (
                  <textarea rows={2} value={row[c.key] || ""} onChange={(e) => update(idx, c.key, e.target.value)} />
                ) : (
                  <input type="text" value={row[c.key] || ""} onChange={(e) => update(idx, c.key, e.target.value)} />
                )}
              </div>
            ))}
            <div className="elist-cell elist-actions" style={{ width: 36, flexShrink: 0 }}>
              <button type="button" className="icon-btn danger" onClick={() => remove(idx)} title="Remover">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionCard({ title, icon, children, className = "" }) {
  return (
    <div className={`card ${className}`}>
      <div className="card-head">
        {icon}
        <h3>{title}</h3>
      </div>
      <div className="meander" />
      <div className="card-body">{children}</div>
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

function Pips({ count, value, onChange, color = "gold" }) {
  return (
    <div className="pips">
      {Array.from({ length: count }).map((_, i) => (
        <button
          type="button"
          key={i}
          className={`pip pip-${color} ${i < value ? "pip-filled" : ""}`}
          onClick={() => onChange(i + 1 === value ? i : i + 1)}
        />
      ))}
    </div>
  );
}

/* ============================================================
   HOME VIEW
   ============================================================ */

function HomeView({ heroes, onOpen, onCreate, onDelete, onDuplicate, loading }) {
  return (
    <div className="home">
      <header className="home-hero">
        <div className="home-hero-inner">
          <div className="brand-eyebrow">SEMIDEUSES RPG · 3ª EDIÇÃO</div>
          <h1 className="brand-title">Criador de Fichas</h1>
          <p className="brand-sub">
            Monte, calcule e evolua o seu semideus — atributos, filiação, perícias, poderes divinos e combate,
            tudo num só lugar, guardado no seu dispositivo.
          </p>
          <button className="btn-primary big" onClick={onCreate}>
            <Plus size={18} /> Novo Herói
          </button>
        </div>
        <div className="meander wide" />
      </header>

      <main className="home-main">
        {loading ? (
          <div className="empty-state">
            <Loader2 className="spin" size={22} />
            <p>Carregando seus heróis…</p>
          </div>
        ) : heroes.length === 0 ? (
          <div className="empty-state">
            <Crown size={30} />
            <h3>Nenhum herói ainda</h3>
            <p>Todo semideus começa em algum lugar. Crie a sua primeira ficha.</p>
            <button className="btn-primary" onClick={onCreate}>
              <Plus size={16} /> Criar meu primeiro herói
            </button>
          </div>
        ) : (
          <div className="hero-grid">
            {heroes.map((h) => {
              const god = GOD_MAP[h.filiacaoId];
              return (
                <div className="hero-card" key={h.id} onClick={() => onOpen(h.id)}>
                  <div className="hero-card-top">
                    <div className="hero-card-icon">
                      <Crown size={16} />
                    </div>
                    <div className="hero-card-level">Nv {h.nivel || 1}</div>
                  </div>
                  <h3 className="hero-card-name">{h.nome || "Herói sem nome"}</h3>
                  <p className="hero-card-god">
                    {god ? `${god.name} — ${god.epithet}` : "Sem filiação definida"}
                  </p>
                  <div className="hero-card-actions">
                    <button
                      className="icon-btn"
                      title="Duplicar"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicate(h.id);
                      }}
                    >
                      <Scroll size={14} />
                    </button>
                    <button
                      className="icon-btn danger"
                      title="Excluir"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(h.id);
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
            <button className="hero-card hero-card-new" onClick={onCreate}>
              <PlusCircle size={26} />
              <span>Novo Herói</span>
            </button>
          </div>
        )}
      </main>
      <footer className="home-footer">
        Ferramenta de fã, baseada no Livro do Jogador de Semideuses RPG (3ª Edição) · Universo Percy Jackson
      </footer>
    </div>
  );
}

/* ============================================================
   SHEET VIEW
   ============================================================ */

function SheetView({ hero, setHero, onBack, saveStatus, rolls, onRoll }) {
  const [tab, setTab] = useState("identidade");
  const [navOpen, setNavOpen] = useState(false);

  const god = GOD_MAP[hero.filiacaoId] || null;
  const conjKey = god ? god.conj : null;
  const conjMod = conjKey ? mod(hero.atributos[conjKey]) : 0;
  const pb = profBonus(hero.nivel);
  const isVigor = !!(god && god.resource);

  const update = (patch) => setHero((h) => ({ ...h, ...patch }));
  const updateAttr = (key, val) => setHero((h) => ({ ...h, atributos: { ...h.atributos, [key]: val } }));
  const updateTR = (key, val) => setHero((h) => ({ ...h, trProf: { ...h.trProf, [key]: val } }));
  const updateCA = (patch) => setHero((h) => ({ ...h, ca: { ...h.ca, ...patch } }));
  const updatePersonalidade = (key, val) =>
    setHero((h) => ({ ...h, personalidade: { ...h.personalidade, [key]: val } }));

  const cycleSkillProf = (name) => {
    setHero((h) => {
      const cur = h.periciasProf[name] || 0;
      const next = (cur + 1) % 3;
      return { ...h, periciasProf: { ...h.periciasProf, [name]: next } };
    });
  };

  const applyGodSuggestions = () => {
    if (!god) return;
    setHero((h) => {
      const trProf = { ...h.trProf };
      god.saves.forEach((k) => (trProf[k] = true));
      const periciasProf = { ...h.periciasProf };
      god.skills.forEach((s) => {
        if (!periciasProf[s]) periciasProf[s] = 1;
      });
      return {
        ...h,
        trProf,
        periciasProf,
        profArmas: h.profArmas || god.weapons,
        profArmaduras: h.profArmaduras || god.armor,
      };
    });
  };

  const pvMaxAuto = god ? pvMax(god.hitDie, hero.nivel, mod(hero.atributos.con)) : 0;
  const pvMaxTotal = hero.pvMaxManual != null && hero.pvMaxManual !== "" ? Number(hero.pvMaxManual) : pvMaxAuto;
  const mpMaxAuto = god ? mpMax(conjMod, hero.nivel, isVigor) : 0;
  const mpMaxTotal = hero.mpMaxManual != null && hero.mpMaxManual !== "" ? Number(hero.mpMaxManual) : mpMaxAuto;

  const desMod = mod(hero.atributos.des);
  let caTotal;
  if (hero.ca.modo === "sem") caTotal = 10 + desMod;
  else if (hero.ca.modo === "leve") caTotal = Number(hero.ca.base || 0) + desMod;
  else if (hero.ca.modo === "media") caTotal = Number(hero.ca.base || 0) + Math.min(desMod, 2);
  else caTotal = Number(hero.ca.base || 0);
  if (hero.ca.escudo) caTotal += 2;

  const iniciativa = desMod + Number(hero.iniciativaExtra || 0);
  const sabMod = mod(hero.atributos.sab);
  const percProf = hero.periciasProf["Percepção"] || 0;
  const percPassiva = 10 + sabMod + (percProf ? pb * percProf : 0);

  const dadosDeVidaTotal = hero.nivel || 1;
  const dadosDeVidaRestantes = Math.max(0, dadosDeVidaTotal - (hero.dadosDeVidaGastos || 0));

  const activeTabDef = TABS.find((t) => t.key === tab);

  return (
    <div className="sheet">
      <aside className={`sidebar ${navOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <button className="btn-ghost small" onClick={onBack}>
            <ChevronLeft size={16} /> Meus Heróis
          </button>
          <button className="icon-btn only-mobile" onClick={() => setNavOpen(false)}>
            <X size={16} />
          </button>
        </div>
        <div className="sidebar-hero">
          <div className="sidebar-hero-icon">
            <Crown size={20} />
          </div>
          <div>
            <div className="sidebar-hero-name">{hero.nome || "Herói sem nome"}</div>
            <div className="sidebar-hero-sub">
              {god ? god.name : "Sem filiação"} · Nv {hero.nivel || 1}
            </div>
          </div>
        </div>
        <div className="meander" />
        <nav className="tabs-nav">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                className={`tab-nav-item ${tab === t.key ? "active" : ""}`}
                onClick={() => {
                  setTab(t.key);
                  setNavOpen(false);
                }}
              >
                <Icon size={16} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className={`save-indicator ${saveStatus}`}>
            {saveStatus === "saving" && (
              <>
                <Loader2 size={13} className="spin" /> Salvando…
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <Check size={13} /> Salvo neste dispositivo
              </>
            )}
            {saveStatus === "pending" && <>Editando…</>}
          </div>
          <button className="btn-ghost small" onClick={() => window.print()}>
            <ScrollText size={14} /> Imprimir ficha
          </button>
        </div>
      </aside>

      <div className="sheet-main">
        <div className="sheet-topbar only-mobile">
          <button className="icon-btn" onClick={() => setNavOpen(true)}>
            <Menu size={18} />
          </button>
          <div className="sheet-topbar-title">
            {activeTabDef && <activeTabDef.icon size={16} />}
            {activeTabDef?.label}
          </div>
        </div>

        <header className="sheet-header">
          <div className="meander wide" />
          <div className="sheet-header-row">
            <input
              className="hero-name-input"
              placeholder="Nome do Herói"
              value={hero.nome}
              onChange={(e) => update({ nome: e.target.value })}
            />
            <div className="hero-header-chips">
              {god && <span className="chip chip-gold">{god.name} — {god.epithet}</span>}
              <span className="chip">{hero.origem}</span>
              <span className="chip">Nível {hero.nivel}</span>
              {hero.caminhoNome && <span className="chip">{hero.caminhoNome}</span>}
            </div>
          </div>
          <div className="meander wide" />
        </header>

        {/* ---------------- IDENTIDADE ---------------- */}
        <section className={`tab-panel ${tab === "identidade" ? "" : "tab-hidden"}`}>
          <SectionCard title="Identidade" icon={<User size={18} />}>
            <div className="grid-2">
              <Field label="Nome do Herói">
                <input value={hero.nome} onChange={(e) => update({ nome: e.target.value })} />
              </Field>
              <Field label="Jogador(a)">
                <input value={hero.jogador} onChange={(e) => update({ jogador: e.target.value })} />
              </Field>
              <Field label="Origem / Raça">
                <select value={hero.origem} onChange={(e) => update({ origem: e.target.value })}>
                  {ORIGINS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label="Filiação (Deus)">
                <select value={hero.filiacaoId} onChange={(e) => update({ filiacaoId: e.target.value })}>
                  <option value="">— Selecione —</option>
                  <optgroup label="Deuses Maiores — os Doze">
                    {GODS.filter((g) => g.group === "maior").map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Deuses Menores">
                    {GODS.filter((g) => g.group === "menor").map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </optgroup>
                </select>
              </Field>
              <Field label="Antecedente">
                <select value={hero.antecedente} onChange={(e) => update({ antecedente: e.target.value })}>
                  <option value="">— Selecione —</option>
                  {BACKGROUNDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </Field>
              {hero.antecedente === "Outro (personalizado)" && (
                <Field label="Antecedente personalizado">
                  <input value={hero.antecedenteCustom} onChange={(e) => update({ antecedenteCustom: e.target.value })} />
                </Field>
              )}
              <Field label="Caminho Divino" hint="Escolhido no nível 3">
                <input value={hero.caminhoNome} onChange={(e) => update({ caminhoNome: e.target.value })} />
              </Field>
              <Field label="Nível">
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={hero.nivel}
                  onChange={(e) => update({ nivel: Math.max(1, Math.min(20, Number(e.target.value) || 1)) })}
                />
              </Field>
              <Field label="Velocidade (m)">
                <input type="number" min={0} value={hero.velocidade} onChange={(e) => update({ velocidade: Number(e.target.value) })} />
              </Field>
              <Field label="Bônus de Proficiência" hint="Calculado automaticamente pelo nível">
                <div className="readonly-box">{fmtMod(pb)}</div>
              </Field>
            </div>
          </SectionCard>

          {god && (
            <SectionCard title={`Filiação — ${god.name}`} icon={<Sparkles size={18} />}>
              <div className="god-card">
                <div className="god-card-row">
                  <span className="chip chip-gold">{god.epithet}</span>
                  <span className="chip">Domínio: {god.domain}</span>
                  <span className="chip">Perfil: {god.playstyle}</span>
                </div>
                <div className="grid-4 tight">
                  <div className="stat-mini">
                    <span>Conjuração</span>
                    <strong>{ATTR_MAP[god.conj].label}</strong>
                  </div>
                  <div className="stat-mini">
                    <span>Dado de Vida</span>
                    <strong>d{god.hitDie}</strong>
                  </div>
                  <div className="stat-mini">
                    <span>TR proficientes</span>
                    <strong>{god.saves.map((s) => ATTR_MAP[s].abbr).join(" / ")}</strong>
                  </div>
                  <div className="stat-mini">
                    <span>Recurso</span>
                    <strong>{god.resource || "Mana (MP)"}</strong>
                  </div>
                  <div className="stat-mini">
                    <span>Armas</span>
                    <strong>{god.weapons}</strong>
                  </div>
                  <div className="stat-mini">
                    <span>Armadura</span>
                    <strong>{god.armor}</strong>
                  </div>
                  <div className="stat-mini">
                    <span>Perícias sugeridas</span>
                    <strong>{god.skills.join(", ")}</strong>
                  </div>
                </div>
                <p className="god-dom"><strong>Dom (passiva).</strong> {god.dom}</p>
                <p className="god-dom"><strong>Assinatura — {god.sig.name}.</strong> {god.sig.text}</p>
                <button className="btn-ghost small" onClick={applyGodSuggestions}>
                  <Check size={14} /> Aplicar sugestões de perícia, TR e proficiências
                </button>
              </div>
            </SectionCard>
          )}
        </section>

        {/* ---------------- ATRIBUTOS ---------------- */}
        <section className={`tab-panel ${tab === "atributos" ? "" : "tab-hidden"}`}>
          <SectionCard title="Atributos" icon={<Compass size={18} />}>
            <p className="hint-text">
              Distribua os valores entre os seis atributos (array padrão sugerido: 15, 14, 13, 12, 10, 8) e some os
              bônus do traço de Semideus Grego: +2 em um atributo e +1 em outro, se aplicável.
            </p>
            <div className="medallion-row">
              {ATTRS.map((a) => (
                <Medallion
                  key={a.key}
                  label={a.label}
                  abbr={a.abbr}
                  score={hero.atributos[a.key]}
                  onScore={(v) => updateAttr(a.key, v)}
                  modVal={mod(hero.atributos[a.key])}
                  prof={hero.trProf[a.key]}
                  onProf={(v) => updateTR(a.key, v)}
                  onRoll={(label, m) => onRoll(`TR de ${label}`, m + (hero.trProf[a.key] ? pb : 0))}
                />
              ))}
            </div>
          </SectionCard>
        </section>

        {/* ---------------- PERÍCIAS & TR ---------------- */}
        <section className={`tab-panel ${tab === "pericias" ? "" : "tab-hidden"}`}>
          <div className="grid-2 align-top">
            <SectionCard title="Perícias" icon={<ScrollText size={18} />}>
              <p className="hint-text small">Clique no círculo: vazio → proficiente → especialização → vazio.</p>
              <div className="skill-table">
                {SKILLS.map((s) => {
                  const p = hero.periciasProf[s.name] || 0;
                  const total = mod(hero.atributos[s.attr]) + (p ? pb * p : 0);
                  return (
                    <div className="skill-row" key={s.name}>
                      <button
                        type="button"
                        className={`skill-dot ${p === 1 ? "prof" : ""} ${p === 2 ? "expert" : ""}`}
                        onClick={() => cycleSkillProf(s.name)}
                        title="Proficiência"
                      />
                      <span className="skill-name">{s.name}</span>
                      <span className="skill-attr">{ATTR_MAP[s.attr].abbr}</span>
                      <span className="skill-total">{fmtMod(total)}</span>
                      <button className="roll-dot inline" onClick={() => onRoll(s.name, total)} title="Rolar">
                        <Dices size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            <div className="stack">
              <SectionCard title="Testes de Resistência" icon={<Shield size={18} />}>
                <div className="skill-table">
                  {ATTRS.map((a) => {
                    const prof = hero.trProf[a.key];
                    const total = mod(hero.atributos[a.key]) + (prof ? pb : 0);
                    return (
                      <div className="skill-row" key={a.key}>
                        <button
                          type="button"
                          className={`skill-dot ${prof ? "prof" : ""}`}
                          onClick={() => updateTR(a.key, !prof)}
                          title="Proficiência"
                        />
                        <span className="skill-name">{a.label}</span>
                        <span className="skill-attr">{a.abbr}</span>
                        <span className="skill-total">{fmtMod(total)}</span>
                        <button className="roll-dot inline" onClick={() => onRoll(`TR de ${a.label}`, total)} title="Rolar">
                          <Dices size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="mini-divider" />
                <div className="flex-between">
                  <span className="field-label">Percepção Passiva</span>
                  <strong>{percPassiva}</strong>
                </div>
              </SectionCard>

              <SectionCard title="Testes de Morte" icon={<Skull size={18} />}>
                <p className="hint-text small">1d20 + Teste de Resistência de Constituição. 3 sucessos estabiliza; 3 falhas, morte.</p>
                <div className="death-row">
                  <div>
                    <span className="field-label">Sucessos</span>
                    <Pips count={3} value={hero.testesMorte.sucessos} color="teal" onChange={(v) => update({ testesMorte: { ...hero.testesMorte, sucessos: v } })} />
                  </div>
                  <div>
                    <span className="field-label">Falhas</span>
                    <Pips count={3} value={hero.testesMorte.falhas} color="blood" onChange={(v) => update({ testesMorte: { ...hero.testesMorte, falhas: v } })} />
                  </div>
                </div>
                <button
                  className="btn-ghost small"
                  onClick={() => {
                    const conMod = mod(hero.atributos.con);
                    onRoll("Teste de Morte (CON)", conMod + (hero.trProf.con ? pb : 0));
                  }}
                >
                  <Dices size={14} /> Rolar Teste de Morte
                </button>
              </SectionCard>
            </div>
          </div>
        </section>

        {/* ---------------- COMBATE ---------------- */}
        <section className={`tab-panel ${tab === "combate" ? "" : "tab-hidden"}`}>
          <div className="grid-3">
            <SectionCard title="Pontos de Vida" icon={<Heart size={18} />} className="card-blood">
              <div className="grid-3 tight">
                <Field label="Atual">
                  <input type="number" value={hero.pvAtual ?? pvMaxTotal} onChange={(e) => update({ pvAtual: Number(e.target.value) })} />
                </Field>
                <Field label="Máximo" hint="Auto (editável)">
                  <input type="number" value={hero.pvMaxManual ?? pvMaxTotal} onChange={(e) => update({ pvMaxManual: e.target.value === "" ? null : Number(e.target.value) })} />
                </Field>
                <Field label="Temporário">
                  <input type="number" value={hero.pvTemp} onChange={(e) => update({ pvTemp: Number(e.target.value) })} />
                </Field>
              </div>
              <div className="mini-divider" />
              <div className="flex-between">
                <span className="field-label">Dados de Vida</span>
                <strong>{dadosDeVidaRestantes} / {dadosDeVidaTotal} {god ? `(d${god.hitDie})` : ""}</strong>
              </div>
              <Field label="Dados de Vida gastos">
                <input type="number" min={0} max={dadosDeVidaTotal} value={hero.dadosDeVidaGastos} onChange={(e) => update({ dadosDeVidaGastos: Number(e.target.value) })} />
              </Field>
            </SectionCard>

            <SectionCard title={god?.resource ? god.resource : "Mana"} icon={<Droplets size={18} />} className="card-aegean">
              <div className="grid-2 tight">
                <Field label="Atual">
                  <input type="number" value={hero.mpAtual ?? mpMaxTotal} onChange={(e) => update({ mpAtual: Number(e.target.value) })} />
                </Field>
                <Field label="Máximo" hint="Auto (editável)">
                  <input type="number" value={hero.mpMaxManual ?? mpMaxTotal} onChange={(e) => update({ mpMaxManual: e.target.value === "" ? null : Number(e.target.value) })} />
                </Field>
              </div>
              {god && (
                <p className="hint-text small">
                  Conjuração: {ATTR_MAP[god.conj].label} ({fmtMod(conjMod)}). CD das habilidades: {8 + pb + conjMod}.
                </p>
              )}
            </SectionCard>

            <SectionCard title="Defesa & Ação" icon={<Shield size={18} />}>
              <div className="grid-2 tight">
                <Field label="Modo de CA">
                  <select value={hero.ca.modo} onChange={(e) => updateCA({ modo: e.target.value })}>
                    <option value="sem">Sem armadura (10 + DES)</option>
                    <option value="leve">Armadura leve (base + DES)</option>
                    <option value="media">Armadura média (base + DES, máx +2)</option>
                    <option value="pesada">Armadura pesada (base fixa)</option>
                  </select>
                </Field>
                {hero.ca.modo !== "sem" && (
                  <Field label="CA base da armadura">
                    <input type="number" value={hero.ca.base} onChange={(e) => updateCA({ base: Number(e.target.value) })} />
                  </Field>
                )}
              </div>
              <label className="checkbox-row">
                <input type="checkbox" checked={hero.ca.escudo} onChange={(e) => updateCA({ escudo: e.target.checked })} />
                <span>Usando escudo (+2)</span>
              </label>
              <div className="mini-divider" />
              <div className="grid-3 tight">
                <div className="stat-mini big">
                  <span>CA</span>
                  <strong>{caTotal}</strong>
                </div>
                <div className="stat-mini big">
                  <span>Iniciativa</span>
                  <strong>{fmtMod(iniciativa)}</strong>
                  <button className="roll-dot inline" onClick={() => onRoll("Iniciativa", iniciativa)}>
                    <Dices size={12} />
                  </button>
                </div>
                <div className="stat-mini big">
                  <span>Percep. Passiva</span>
                  <strong>{percPassiva}</strong>
                </div>
              </div>
              <Field label="Bônus extra de Iniciativa">
                <input type="number" value={hero.iniciativaExtra} onChange={(e) => update({ iniciativaExtra: Number(e.target.value) })} />
              </Field>
              <div className="mini-divider" />
              <Field label="Favor Divino (0–3)">
                <Pips count={3} value={hero.favor} color="gold" onChange={(v) => update({ favor: v })} />
              </Field>
            </SectionCard>
          </div>

          <SectionCard title="Assinatura & Sustentação" icon={<Flame size={18} />}>
            <div className="grid-2">
              <Field label="Mecânica da Assinatura (cargas, almas, fúria…) · atual / máx" hint={god ? `${god.sig.name}: ${god.sig.text}` : ""}>
                <input value={hero.assinaturaTexto} onChange={(e) => update({ assinaturaTexto: e.target.value })} placeholder="ex: Cargas 3/5" />
              </Field>
            </div>
            <div className="grid-2">
              <Field label="Bênção Ativa 1">
                <input value={hero.bencaos[0]} onChange={(e) => update({ bencaos: [e.target.value, hero.bencaos[1]] })} />
              </Field>
              <Field label="Bênção Ativa 2">
                <input value={hero.bencaos[1]} onChange={(e) => update({ bencaos: [hero.bencaos[0], e.target.value] })} />
              </Field>
            </div>
          </SectionCard>

          <EditableList
            title="Ataques, Armas e Poderes"
            icon={<Sword size={18} />}
            rows={hero.ataques}
            onChange={(rows) => update({ ataques: rows })}
            addLabel="Adicionar ataque"
            columns={[
              { key: "nome", label: "Arma / Poder", flex: 2 },
              { key: "bonus", label: "Bônus", flex: "90px" },
              { key: "dano", label: "Dano", flex: "110px" },
              { key: "tipo", label: "Tipo", flex: 1 },
              { key: "notas", label: "Notas", flex: 2 },
            ]}
          />

          <SectionCard title="Proficiências" icon={<BookOpen size={18} />}>
            <div className="grid-3">
              <Field label="Armas">
                <input value={hero.profArmas} onChange={(e) => update({ profArmas: e.target.value })} />
              </Field>
              <Field label="Armaduras">
                <input value={hero.profArmaduras} onChange={(e) => update({ profArmaduras: e.target.value })} />
              </Field>
              <Field label="Ferramentas">
                <input value={hero.profFerramentas} onChange={(e) => update({ profFerramentas: e.target.value })} />
              </Field>
            </div>
          </SectionCard>
        </section>

        {/* ---------------- PODERES DIVINOS ---------------- */}
        <section className={`tab-panel ${tab === "poderes" ? "" : "tab-hidden"}`}>
          <EditableList
            title="Habilidades de Raça / Origem"
            icon={<Users size={18} />}
            rows={hero.habilidadesRaca}
            onChange={(rows) => update({ habilidadesRaca: rows })}
            addLabel="Adicionar"
            columns={[
              { key: "nome", label: "Habilidade / Traço", flex: 1 },
              { key: "descricao", label: "Descrição, efeito e limitações", type: "textarea", flex: 3 },
            ]}
          />
          <EditableList
            title="Habilidades de Filiação (base)"
            icon={<Sparkles size={18} />}
            rows={hero.habilidadesFiliacao}
            onChange={(rows) => update({ habilidadesFiliacao: rows })}
            addLabel="Adicionar habilidade"
            hint={god ? `Dom: ${god.dom} · Assinatura — ${god.sig.name}: ${god.sig.text}` : "Selecione uma Filiação na aba Identidade para ver o Dom e a Assinatura."}
            columns={[
              { key: "nome", label: "Habilidade", flex: 2 },
              { key: "nv", label: "Nv", flex: "50px" },
              { key: "rank", label: "Rank", flex: "60px" },
              { key: "custo", label: "Custo", flex: "70px" },
              { key: "tipo", label: "Tipo", flex: 1 },
              { key: "descricao", label: "Descrição", type: "textarea", flex: 3 },
            ]}
          />
          <EditableList
            title="Caminho Divino"
            icon={<Compass size={18} />}
            rows={hero.habilidadesCaminho}
            onChange={(rows) => update({ habilidadesCaminho: rows })}
            addLabel="Adicionar habilidade"
            hint="Escolhido no nível 3 — concede novas habilidades nos níveis 7, 12 e 17."
            columns={[
              { key: "nome", label: "Habilidade", flex: 2 },
              { key: "nv", label: "Nv", flex: "50px" },
              { key: "rank", label: "Rank", flex: "60px" },
              { key: "custo", label: "Custo", flex: "70px" },
              { key: "tipo", label: "Tipo", flex: 1 },
              { key: "descricao", label: "Descrição", type: "textarea", flex: 3 },
            ]}
          />
          <EditableList
            title="Skills (Sistema de Criação de Skill)"
            icon={<Wand2 size={18} />}
            rows={hero.skillsSistema}
            onChange={(rows) => update({ skillsSistema: rows })}
            addLabel="Adicionar skill"
            columns={[
              { key: "nome", label: "Skill", flex: 2 },
              { key: "tipo", label: "Tipo", flex: 1 },
              { key: "rank", label: "Rank", flex: "60px" },
              { key: "mp", label: "MP", flex: "60px" },
              { key: "recarga", label: "Recarga", flex: 1 },
              { key: "descricao", label: "Descrição", type: "textarea", flex: 3 },
            ]}
          />
        </section>

        {/* ---------------- TALENTOS ---------------- */}
        <section className={`tab-panel ${tab === "talentos" ? "" : "tab-hidden"}`}>
          <EditableList
            title="Talentos & Especializações"
            icon={<Star size={18} />}
            rows={hero.talentos}
            onChange={(rows) => update({ talentos: rows })}
            addLabel="Adicionar talento"
            columns={[
              { key: "nome", label: "Talento", flex: 1 },
              { key: "categoria", label: "Categoria", flex: 1 },
              { key: "descricao", label: "Descrição — efeito, condições", type: "textarea", flex: 3 },
            ]}
          />
        </section>

        {/* ---------------- EQUIPAMENTO ---------------- */}
        <section className={`tab-panel ${tab === "equipamento" ? "" : "tab-hidden"}`}>
          <div className="grid-2 align-top">
            <EditableList
              title="Relíquias & Itens Divinos"
              icon={<Star size={18} />}
              rows={hero.reliquias}
              onChange={(rows) => update({ reliquias: rows })}
              addLabel="Adicionar relíquia"
              columns={[
                { key: "nome", label: "Nome", flex: 1 },
                { key: "descricao", label: "Descrição", type: "textarea", flex: 2 },
              ]}
            />
            <EditableList
              title="Equipamento"
              icon={<Backpack size={18} />}
              rows={hero.equipamento}
              onChange={(rows) => update({ equipamento: rows })}
              addLabel="Adicionar item"
              columns={[
                { key: "nome", label: "Nome", flex: 1 },
                { key: "descricao", label: "Descrição", type: "textarea", flex: 2 },
              ]}
            />
          </div>
          <SectionCard title="Idiomas & Dracmas" icon={<Coins size={18} />}>
            <div className="grid-2">
              <Field label="Idiomas">
                <input value={hero.idiomas} onChange={(e) => update({ idiomas: e.target.value })} placeholder="ex: Grego Antigo, Inglês" />
              </Field>
              <Field label="Dracmas de Ouro">
                <input type="number" min={0} value={hero.dracmas} onChange={(e) => update({ dracmas: Number(e.target.value) })} />
              </Field>
            </div>
          </SectionCard>
        </section>

        {/* ---------------- PERSONALIDADE ---------------- */}
        <section className={`tab-panel ${tab === "personalidade" ? "" : "tab-hidden"}`}>
          <SectionCard title="Personalidade" icon={<Feather size={18} />}>
            <div className="grid-2">
              <Field label="Traço">
                <textarea rows={3} value={hero.personalidade.traco} onChange={(e) => updatePersonalidade("traco", e.target.value)} />
              </Field>
              <Field label="Ideal">
                <textarea rows={3} value={hero.personalidade.ideal} onChange={(e) => updatePersonalidade("ideal", e.target.value)} />
              </Field>
              <Field label="Vínculo">
                <textarea rows={3} value={hero.personalidade.vinculo} onChange={(e) => updatePersonalidade("vinculo", e.target.value)} />
              </Field>
              <Field label="Falha">
                <textarea rows={3} value={hero.personalidade.falha} onChange={(e) => updatePersonalidade("falha", e.target.value)} />
              </Field>
            </div>
          </SectionCard>
          <SectionCard title="Aparência & História" icon={<Scroll size={18} />}>
            <Field label="Aparência">
              <textarea rows={3} value={hero.aparencia} onChange={(e) => update({ aparencia: e.target.value })} />
            </Field>
            <Field label="História (resumo)">
              <textarea rows={5} value={hero.historia} onChange={(e) => update({ historia: e.target.value })} />
            </Field>
          </SectionCard>
          <SectionCard title="Notas" icon={<Feather size={18} />}>
            <textarea rows={6} value={hero.notas} onChange={(e) => update({ notas: e.target.value })} />
          </SectionCard>
        </section>
      </div>

      <div className="roll-panel only-desktop">
        <div className="roll-panel-head">
          <Dices size={14} /> Rolagens
        </div>
        {rolls.length === 0 && <p className="roll-empty">Clique nos dados ao lado de perícias, TRs e ataques.</p>}
        {rolls.map((r) => (
          <div className={`roll-item ${r.crit ? "crit" : ""} ${r.fumble ? "fumble" : ""}`} key={r.id}>
            <span className="roll-label">{r.label}</span>
            <span className="roll-detail">
              d20({r.d}) {fmtMod(r.modifier)}
            </span>
            <span className="roll-total">{r.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   APP RAIZ
   ============================================================ */

export default function App() {
  const [view, setView] = useState("home");
  const [heroes, setHeroes] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(true);
  const [hero, setHero] = useState(null);
  const [saveStatus, setSaveStatus] = useState("saved");
  const [rolls, setRolls] = useState([]);
  const saveTimer = useRef(null);
  const storageOk = typeof window !== "undefined" && !!window.storage;

  useEffect(() => {
    (async () => {
      if (!storageOk) {
        setLoadingIndex(false);
        return;
      }
      const idx = await loadIndex();
      idx.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      setHeroes(idx);
      setLoadingIndex(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRoll = useCallback((label, modifier) => {
    const d = 1 + Math.floor(Math.random() * 20);
    const total = d + Number(modifier || 0);
    setRolls((r) => [{ id: uid(), label, d, modifier: Number(modifier || 0), total, crit: d === 20, fumble: d === 1 }, ...r].slice(0, 14));
  }, []);

  useEffect(() => {
    if (!hero || view !== "sheet") return;
    setSaveStatus("pending");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      if (!storageOk) {
        setSaveStatus("saved");
        return;
      }
      setSaveStatus("saving");
      const toSave = { ...hero, updatedAt: Date.now() };
      await saveHeroRemote(toSave);
      const entry = {
        id: hero.id,
        nome: hero.nome,
        filiacaoId: hero.filiacaoId,
        nivel: hero.nivel,
        updatedAt: toSave.updatedAt,
      };
      setHeroes((prev) => {
        const next = [entry, ...prev.filter((x) => x.id !== hero.id)];
        saveIndex(next);
        return next;
      });
      setSaveStatus("saved");
    }, 650);
    return () => clearTimeout(saveTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hero, view]);

  const handleCreate = () => {
    const h = emptyHero();
    setHero(h);
    setView("sheet");
    setSaveStatus("pending");
  };

  const handleOpen = async (id) => {
    if (!storageOk) return;
    const h = await loadHero(id);
    if (h) {
      setHero(h);
      setView("sheet");
      setSaveStatus("saved");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Excluir esta ficha permanentemente?")) return;
    await deleteHeroRemote(id);
    setHeroes((prev) => {
      const next = prev.filter((x) => x.id !== id);
      saveIndex(next);
      return next;
    });
  };

  const handleDuplicate = async (id) => {
    const h = await loadHero(id);
    if (!h) return;
    const copy = { ...h, id: uid(), nome: (h.nome || "Herói") + " (cópia)", updatedAt: Date.now() };
    await saveHeroRemote(copy);
    setHeroes((prev) => {
      const entry = { id: copy.id, nome: copy.nome, filiacaoId: copy.filiacaoId, nivel: copy.nivel, updatedAt: copy.updatedAt };
      const next = [entry, ...prev];
      saveIndex(next);
      return next;
    });
  };

  const handleBack = () => {
    setView("home");
    setHero(null);
    setRolls([]);
  };

  return (
    <div className="app-root">
      <style>{CSS}</style>
      {!storageOk && (
        <div className="storage-warning">
          Armazenamento não disponível neste ambiente — suas fichas não serão salvas entre sessões.
        </div>
      )}
      {view === "home" && (
        <HomeView
          heroes={heroes}
          loading={loadingIndex}
          onOpen={handleOpen}
          onCreate={handleCreate}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        />
      )}
      {view === "sheet" && hero && (
        <SheetView hero={hero} setHero={setHero} onBack={handleBack} saveStatus={saveStatus} rolls={rolls} onRoll={onRoll} />
      )}
    </div>
  );
}

/* ============================================================
   CSS
   ============================================================ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600;700&display=swap');

:root{
  --void:#141225;
  --void2:#1b1830;
  --void3:#242040;
  --panel:#1f1c35;
  --parchment:#ece1c5;
  --parchment2:#ddceA4;
  --ink:#2c2415;
  --ink-soft:#5b4f37;
  --gold:#c9a24d;
  --gold-bright:#e9cf88;
  --bronze:#8a6a34;
  --blood:#a2453f;
  --aegean:#337a80;
  --teal:#3f8f7c;
  --mist:#b9b4d9;
  --mist-dim:#8783ab;
  --line: rgba(201,162,77,0.35);
  --radius: 10px;
}

.app-root{
  min-height:100vh;
  background:
    radial-gradient(ellipse at top, #201c3a 0%, var(--void) 55%),
    var(--void);
  color: var(--mist);
  font-family:'Inter',sans-serif;
}
.app-root *{ box-sizing:border-box; }
.app-root input, .app-root select, .app-root textarea, .app-root button{ font-family:inherit; }

.storage-warning{
  background:#4a2b2b; color:#f3d7d7; padding:8px 16px; font-size:13px; text-align:center;
}

.meander{
  height:9px;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='36' height='9'><path d='M0 1 H9 V8 H18 V1 H27 V8 H36' stroke='%23c9a24d' stroke-width='1.6' fill='none'/></svg>");
  background-repeat:repeat-x;
  opacity:0.55;
  margin:6px 0;
}
.meander.wide{ height:11px; opacity:0.7; }

/* ---------- HOME ---------- */
.home{ max-width:1100px; margin:0 auto; padding:0 20px 60px; }
.home-hero{ padding:64px 8px 30px; text-align:center; }
.home-hero-inner{ max-width:640px; margin:0 auto; }
.brand-eyebrow{ letter-spacing:.18em; font-size:11px; color:var(--gold); font-weight:600; }
.brand-title{
  font-family:'Cinzel',serif; font-size:44px; margin:10px 0 14px; color:var(--parchment);
  text-shadow:0 0 24px rgba(201,162,77,.25);
}
.brand-sub{ color:var(--mist-dim); line-height:1.6; margin-bottom:26px; font-size:15px;}
.home-main{ margin-top:20px; }
.hero-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(230px,1fr)); gap:16px; }
.hero-card{
  background:linear-gradient(180deg, var(--panel), var(--void2));
  border:1px solid var(--line); border-radius:var(--radius); padding:16px;
  cursor:pointer; position:relative; transition:transform .15s ease, border-color .15s ease;
  min-height:120px; text-align:left;
}
.hero-card:hover{ transform:translateY(-2px); border-color:var(--gold); }
.hero-card-top{ display:flex; align-items:center; justify-content:space-between; color:var(--gold); margin-bottom:8px;}
.hero-card-level{ font-size:12px; background:var(--void3); padding:2px 8px; border-radius:20px; color:var(--gold-bright); }
.hero-card-name{ font-family:'Cinzel',serif; font-size:17px; color:var(--parchment); margin:0 0 4px; }
.hero-card-god{ font-size:12.5px; color:var(--mist-dim); margin:0; }
.hero-card-actions{ position:absolute; top:12px; right:12px; display:flex; gap:4px; opacity:0; transition:opacity .15s; }
.hero-card:hover .hero-card-actions{ opacity:1; }
.hero-card-new{
  display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px;
  border:1.5px dashed var(--line); color:var(--gold); background:transparent;
}
.hero-card-new:hover{ background:var(--void2); }
.home-footer{ text-align:center; color:var(--mist-dim); font-size:11.5px; margin-top:50px; opacity:.7; }
.empty-state{ text-align:center; padding:60px 20px; color:var(--mist-dim); display:flex; flex-direction:column; align-items:center; gap:10px; }
.empty-state h3{ color:var(--parchment); font-family:'Cinzel',serif; font-weight:600; margin:4px 0; }

/* ---------- BUTTONS ---------- */
.btn-primary{
  display:inline-flex; align-items:center; gap:8px; background:linear-gradient(180deg,var(--gold-bright),var(--gold));
  color:#241c08; border:none; padding:10px 18px; border-radius:8px; font-weight:600; cursor:pointer; font-size:14px;
}
.btn-primary.big{ padding:13px 26px; font-size:15px; }
.btn-primary:hover{ filter:brightness(1.08); }
.btn-ghost{
  display:inline-flex; align-items:center; gap:6px; background:transparent; border:1px solid var(--line);
  color:var(--mist); padding:8px 12px; border-radius:8px; cursor:pointer; font-size:13px;
}
.btn-ghost:hover{ border-color:var(--gold); color:var(--gold-bright); }
.btn-ghost.small{ padding:5px 10px; font-size:12px; }
.icon-btn{
  display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:6px;
  background:var(--void3); color:var(--mist); border:1px solid var(--line); cursor:pointer;
}
.icon-btn:hover{ color:var(--gold-bright); border-color:var(--gold); }
.icon-btn.danger:hover{ color:#ff8b8b; border-color:#a2453f; }
.spin{ animation:spin 1s linear infinite; }
@keyframes spin{ to{ transform:rotate(360deg);} }

/* ---------- SHEET LAYOUT ---------- */
.sheet{ display:flex; min-height:100vh; }
.sidebar{
  width:230px; flex-shrink:0; background:var(--void2); border-right:1px solid var(--line);
  display:flex; flex-direction:column; padding:16px 14px; position:sticky; top:0; height:100vh; overflow-y:auto;
}
.sidebar-top{ display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
.sidebar-hero{ display:flex; align-items:center; gap:10px; padding:8px 4px; }
.sidebar-hero-icon{
  width:34px; height:34px; border-radius:50%; background:var(--void3); color:var(--gold);
  display:flex; align-items:center; justify-content:center; border:1px solid var(--line);
}
.sidebar-hero-name{ font-family:'Cinzel',serif; font-size:14px; color:var(--parchment); line-height:1.2; }
.sidebar-hero-sub{ font-size:11px; color:var(--mist-dim); }
.tabs-nav{ display:flex; flex-direction:column; gap:2px; margin-top:8px; flex:1; }
.tab-nav-item{
  display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:7px; background:transparent;
  border:none; color:var(--mist-dim); text-align:left; cursor:pointer; font-size:13.5px;
}
.tab-nav-item:hover{ background:var(--void3); color:var(--mist); }
.tab-nav-item.active{ background:linear-gradient(90deg, rgba(201,162,77,.18), transparent); color:var(--gold-bright); }
.sidebar-bottom{ margin-top:auto; padding-top:12px; display:flex; flex-direction:column; gap:8px; }
.save-indicator{ font-size:11.5px; color:var(--mist-dim); display:flex; align-items:center; gap:5px; }
.save-indicator.saved{ color:var(--teal); }

.sheet-main{ flex:1; padding:26px 30px 80px; max-width:980px; }
.sheet-topbar{ display:none; }
.sheet-header{ margin-bottom:18px; }
.sheet-header-row{ display:flex; flex-direction:column; gap:10px; padding:6px 0; }
.hero-name-input{
  background:transparent; border:none; font-family:'Cinzel',serif; font-size:30px; color:var(--parchment);
  padding:2px 0; outline:none;
}
.hero-name-input::placeholder{ color:var(--mist-dim); }
.hero-header-chips{ display:flex; gap:8px; flex-wrap:wrap; }
.chip{
  font-size:11.5px; padding:4px 10px; border-radius:20px; background:var(--void3); color:var(--mist);
  border:1px solid var(--line);
}
.chip-gold{ color:#241c08; background:linear-gradient(180deg,var(--gold-bright),var(--gold)); border:none; font-weight:600; }

.tab-panel{ display:flex; flex-direction:column; gap:18px; }
.tab-hidden{ display:none; }

/* ---------- CARDS ---------- */
.card{
  background:linear-gradient(180deg, var(--panel), var(--void2)); border:1px solid var(--line);
  border-radius:var(--radius); padding:18px 20px;
}
.card-head{ display:flex; align-items:center; gap:9px; color:var(--gold); }
.card-head h3{ font-family:'Cinzel',serif; font-size:16px; color:var(--parchment); margin:0; font-weight:600; }
.card-body{ margin-top:4px; }
.card-blood .card-head{ color:var(--blood); }
.card-aegean .card-head{ color:var(--aegean); }

.god-card{ display:flex; flex-direction:column; gap:12px; }
.god-card-row{ display:flex; gap:8px; flex-wrap:wrap; }
.god-dom{ font-family:'Cormorant Garamond',serif; font-size:16px; line-height:1.5; color:var(--parchment2); margin:0; }
.stat-mini{ display:flex; flex-direction:column; gap:3px; background:var(--void3); border-radius:8px; padding:8px 10px; }
.stat-mini span{ font-size:10.5px; color:var(--mist-dim); text-transform:uppercase; letter-spacing:.04em; }
.stat-mini strong{ font-size:13px; color:var(--parchment); font-weight:600; }
.stat-mini.big strong{ font-size:22px; color:var(--gold-bright); font-family:'Cinzel',serif; }

/* ---------- GRIDS / FIELDS ---------- */
.grid-2{ display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.grid-3{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }
.grid-4{ display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
.grid-2.align-top, .grid-3.align-top{ align-items:start; }
.tight{ gap:8px; }
.field{ display:flex; flex-direction:column; gap:5px; }
.field-label{ font-size:11.5px; color:var(--mist-dim); text-transform:uppercase; letter-spacing:.04em; }
.field-hint{ font-size:10.5px; color:var(--mist-dim); opacity:.8; }
.hint-text{ font-family:'Cormorant Garamond',serif; font-size:15px; color:var(--mist); line-height:1.5; margin:0 0 12px; }
.hint-text.small{ font-size:13px; }

input[type=text], input[type=number], select, textarea, input:not([type]){
  background:var(--void); border:1px solid var(--line); border-radius:6px; padding:8px 10px;
  color:var(--parchment); font-size:13.5px; outline:none; width:100%;
}
textarea{ resize:vertical; font-family:'Cormorant Garamond',serif; font-size:15px; line-height:1.4; }
input:focus, select:focus, textarea:focus{ border-color:var(--gold); box-shadow:0 0 0 2px rgba(201,162,77,.15); }
.readonly-box{
  background:var(--void3); border:1px solid var(--line); border-radius:6px; padding:8px 10px; color:var(--gold-bright);
  font-weight:600;
}
.checkbox-row{ display:flex; align-items:center; gap:7px; font-size:13px; color:var(--mist); margin:10px 0; }
.mini-divider{ height:1px; background:var(--line); margin:12px 0; }
.flex-between{ display:flex; align-items:center; justify-content:space-between; }
.stack{ display:flex; flex-direction:column; gap:18px; }

/* ---------- MEDALLIONS (atributos) ---------- */
.medallion-row{ display:grid; grid-template-columns:repeat(6,1fr); gap:14px; }
.medallion{ display:flex; flex-direction:column; align-items:center; gap:6px; position:relative; padding-top:6px; }
.medallion-ring{
  width:64px; height:64px; border-radius:50%; border:2.5px solid var(--gold); background:var(--void3);
  display:flex; align-items:center; justify-content:center;
  box-shadow: inset 0 0 0 3px var(--void2), 0 0 14px rgba(201,162,77,.18);
}
.medallion-mod{ font-family:'Cinzel',serif; font-size:20px; color:var(--gold-bright); }
.medallion-abbr{ font-size:11px; letter-spacing:.1em; color:var(--mist-dim); }
.medallion-score{ width:56px; text-align:center; padding:4px; }
.medallion-prof{ display:flex; align-items:center; gap:4px; font-size:10.5px; color:var(--mist-dim); }
.medallion-label{ font-size:12px; color:var(--mist); }
.roll-dot{
  position:absolute; top:0; right:6px; width:22px; height:22px; border-radius:50%; background:var(--void3);
  border:1px solid var(--line); color:var(--gold); display:flex; align-items:center; justify-content:center; cursor:pointer;
}
.roll-dot:hover{ border-color:var(--gold); color:var(--gold-bright); }
.roll-dot.inline{ position:static; width:20px; height:20px; }

/* ---------- SKILLS TABLE ---------- */
.skill-table{ display:flex; flex-direction:column; gap:2px; }
.skill-row{ display:grid; grid-template-columns:20px 1fr 34px 34px 22px; align-items:center; gap:8px; padding:5px 2px; border-bottom:1px dashed var(--line); }
.skill-dot{ width:13px; height:13px; border-radius:50%; border:1.6px solid var(--gold); background:transparent; cursor:pointer; }
.skill-dot.prof{ background:var(--gold); }
.skill-dot.expert{ background:var(--gold-bright); box-shadow:0 0 0 3px rgba(233,207,136,.35); }
.skill-name{ font-size:13.5px; color:var(--mist); }
.skill-attr{ font-size:10.5px; color:var(--mist-dim); text-align:center; }
.skill-total{ font-family:'Cinzel',serif; font-size:13.5px; color:var(--gold-bright); text-align:right; }

.death-row{ display:flex; gap:26px; margin:10px 0; }
.pips{ display:flex; gap:6px; margin-top:4px; }
.pip{ width:16px; height:16px; border-radius:50%; border:1.6px solid var(--gold); background:transparent; cursor:pointer; }
.pip-filled.pip-gold{ background:var(--gold); }
.pip-filled.pip-teal{ background:var(--teal); border-color:var(--teal); }
.pip-filled.pip-blood{ background:var(--blood); border-color:var(--blood); }

/* ---------- EDITABLE LISTS ---------- */
.elist{ background:linear-gradient(180deg, var(--panel), var(--void2)); border:1px solid var(--line); border-radius:var(--radius); padding:16px 18px; }
.elist-head{ display:flex; align-items:center; justify-content:space-between; gap:10px; color:var(--gold); }
.elist-head-title{ display:flex; align-items:center; gap:9px; }
.elist-head-title h4{ font-family:'Cinzel',serif; font-size:15px; color:var(--parchment); margin:0; font-weight:600; }
.elist-hint{ font-family:'Cormorant Garamond',serif; font-size:14.5px; color:var(--mist-dim); margin:8px 0 0; }
.elist-table{ margin-top:12px; display:flex; flex-direction:column; gap:6px; }
.elist-row{ display:flex; gap:8px; align-items:flex-start; }
.elist-row-head{ padding-bottom:4px; border-bottom:1px solid var(--line); }
.elist-row-head .elist-cell{ font-size:10.5px; text-transform:uppercase; letter-spacing:.04em; color:var(--mist-dim); }
.elist-cell{ display:flex; }
.elist-cell input, .elist-cell textarea{ font-size:13px; }
.elist-actions{ align-items:center; justify-content:center; padding-top:2px; }
.elist-empty{ color:var(--mist-dim); font-size:13px; padding:10px 2px; font-style:italic; }

/* ---------- ROLL PANEL ---------- */
.roll-panel{
  width:220px; flex-shrink:0; border-left:1px solid var(--line); background:var(--void2); padding:16px 14px;
  position:sticky; top:0; height:100vh; overflow-y:auto;
}
.roll-panel-head{ display:flex; align-items:center; gap:7px; color:var(--gold); font-family:'Cinzel',serif; font-size:13px; margin-bottom:10px; }
.roll-empty{ font-size:12px; color:var(--mist-dim); line-height:1.5; }
.roll-item{ display:flex; flex-direction:column; gap:2px; padding:8px 8px; border-radius:7px; background:var(--void3); margin-bottom:6px; }
.roll-item.crit{ box-shadow:0 0 0 1.5px var(--gold); }
.roll-item.fumble{ box-shadow:0 0 0 1.5px var(--blood); }
.roll-label{ font-size:11.5px; color:var(--mist); }
.roll-detail{ font-size:10.5px; color:var(--mist-dim); }
.roll-total{ font-family:'Cinzel',serif; font-size:18px; color:var(--gold-bright); align-self:flex-end; }

.only-mobile{ display:none; }

@media (max-width: 980px){
  .grid-3{ grid-template-columns:1fr 1fr; }
  .medallion-row{ grid-template-columns:repeat(3,1fr); }
}
@media (max-width: 760px){
  .only-desktop{ display:none; }
  .only-mobile{ display:flex; }
  .sidebar{
    position:fixed; z-index:40; left:0; top:0; height:100vh; transform:translateX(-100%);
    transition:transform .2s ease; box-shadow:20px 0 40px rgba(0,0,0,.4);
  }
  .sidebar.open{ transform:translateX(0); }
  .sheet-main{ padding:16px 14px 70px; }
  .sheet-topbar{ display:flex; align-items:center; gap:10px; padding:6px 0 14px; color:var(--gold-bright); font-family:'Cinzel',serif; }
  .grid-2, .grid-3, .grid-4{ grid-template-columns:1fr; }
  .medallion-row{ grid-template-columns:repeat(3,1fr); }
  .hero-name-input{ font-size:24px; }
  .death-row{ flex-direction:column; gap:12px; }
}

/* ---------- PRINT ---------- */
@media print{
  .sidebar, .roll-panel, .sheet-topbar, .storage-warning{ display:none !important; }
  .app-root{ background:#fff; color:#000; }
  .sheet-main{ max-width:100%; padding:0; }
  .card, .elist{ background:#fff; border:1px solid #999; break-inside:avoid; }
  .tab-hidden{ display:flex !important; }
  .hero-name-input{ color:#000; }
  .card-head h3, .elist-head-title h4{ color:#000; }
  .god-dom, .hint-text{ color:#333; }
}
`;
