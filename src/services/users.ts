export type InitiatorAccount = {
  id: string;
  firstName: string;
  secondName: string;
  patronymic: string;
  email: string;
  phone: string;
  clientCode: string;
  organization: string;
  active: boolean;
  userToken: string;
  createdAt: string;
};

const STORAGE_KEY = 'priiz_initiators_v07';
const SESSION_KEY = 'priiz_initiator_session_v07';

const DEFAULT_INITIATORS: InitiatorAccount[] = [
  {
    id: 'init-demo-01',
    firstName: 'Алексей',
    secondName: 'Соколов',
    patronymic: 'Игоревич',
    email: 'demo.initiator@client.ru',
    phone: '+79990000001',
    clientCode: 'CLI-DEMO-01',
    organization: 'ООО «Демо-клиент»',
    active: false,
    userToken: 'demo-user-token-01',
    createdAt: new Date().toISOString(),
  },
];

function load(): InitiatorAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // DEMO fallback.
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INITIATORS));
  return [...DEFAULT_INITIATORS];
}

function save(items: InitiatorAccount[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getInitiators(): InitiatorAccount[] {
  return load();
}

export function getLatestInitiator(): InitiatorAccount {
  const items = load();
  return items[items.length - 1] || DEFAULT_INITIATORS[0];
}

export function getInitiatorById(id: string): InitiatorAccount | undefined {
  return load().find((x) => x.id === id);
}

export function createInitiator(input: Omit<InitiatorAccount, 'id' | 'active' | 'userToken' | 'createdAt'>): InitiatorAccount {
  const items = load();
  const existing = items.find((x) => x.email.toLowerCase() === input.email.toLowerCase());
  if (existing) return existing;
  const created: InitiatorAccount = {
    ...input,
    id: `init-${Date.now()}`,
    active: false,
    userToken: `demo-${Math.random().toString(36).slice(2, 12)}`,
    createdAt: new Date().toISOString(),
  };
  items.push(created);
  save(items);
  return created;
}

export function activateInitiator(id: string): InitiatorAccount {
  const items = load().map((x) => x.id === id ? { ...x, active: true } : x);
  save(items);
  return items.find((x) => x.id === id)!;
}

export function startInitiatorSession(id: string) {
  localStorage.setItem(SESSION_KEY, id);
}

export function getInitiatorSession(): InitiatorAccount | undefined {
  const id = localStorage.getItem(SESSION_KEY);
  return id ? getInitiatorById(id) : undefined;
}

export function endInitiatorSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function resetInitiators() {
  save([...DEFAULT_INITIATORS]);
  endInitiatorSession();
}
