import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Tab = "chats" | "contacts" | "notifications" | "settings" | "about" | "profile";

type Message = {
  id: number;
  text: string;
  mine: boolean;
  time: string;
};

const chatMessages: Record<number, Message[]> = {
  1: [
    { id: 1, text: "Привет! Как дела с проектом?", mine: false, time: "14:10" },
    { id: 2, text: "Всё идёт по плану, заканчиваю последний блок", mine: true, time: "14:12" },
    { id: 3, text: "Супер! Когда сможешь сдать?", mine: false, time: "14:15" },
    { id: 4, text: "Думаю завтра к обеду всё готово будет", mine: true, time: "14:20" },
    { id: 5, text: "Отлично, договорились!", mine: false, time: "14:32" },
  ],
  2: [
    { id: 1, text: "Всем привет! Напоминаю про митинг", mine: false, time: "13:00" },
    { id: 2, text: "Буду 👍", mine: true, time: "13:05" },
    { id: 3, text: "Митинг завтра в 10:00", mine: false, time: "13:15" },
  ],
  3: [
    { id: 1, text: "Мария, скинула тебе файлы на почту", mine: true, time: "11:30" },
    { id: 2, text: "Получила, смотрю!", mine: false, time: "11:40" },
    { id: 3, text: "Спасибо за помощь 🙏", mine: false, time: "11:48" },
  ],
  4: [{ id: 1, text: "Документы отправил", mine: false, time: "09:22" }],
  5: [{ id: 1, text: "Ваш запрос №1245 обработан", mine: false, time: "Вчера" }],
  6: [{ id: 1, text: "Когда сможешь созвониться?", mine: false, time: "Вчера" }],
  7: [{ id: 1, text: "Проблема с подключением решена", mine: false, time: "Пн" }],
};

const chats = [
  { id: 1, name: "Алексей Морозов", message: "Отлично, договорились!", time: "14:32", unread: 2, online: true },
  { id: 2, name: "Команда продукта", message: "Митинг завтра в 10:00", time: "13:15", unread: 5, online: false },
  { id: 3, name: "Мария Соколова", message: "Спасибо за помощь 🙏", time: "11:48", unread: 0, online: true },
  { id: 4, name: "Дмитрий Козлов", message: "Документы отправил", time: "09:22", unread: 0, online: false },
  { id: 5, name: "HR Поддержка", message: "Ваш запрос обработан", time: "Вчера", unread: 1, online: false },
  { id: 6, name: "Анна Петрова", message: "Когда сможешь созвониться?", time: "Вчера", unread: 0, online: true },
  { id: 7, name: "Техподдержка", message: "Проблема решена", time: "Пн", unread: 0, online: false },
];

const contacts = [
  { id: 1, name: "Алексей Морозов", role: "Менеджер проекта", online: true },
  { id: 2, name: "Анна Петрова", role: "Дизайнер", online: true },
  { id: 3, name: "Дмитрий Козлов", role: "Разработчик", online: false },
  { id: 4, name: "Елена Новикова", role: "Аналитик", online: false },
  { id: 5, name: "Мария Соколова", role: "Маркетолог", online: true },
  { id: 6, name: "Сергей Иванов", role: "Директор", online: false },
];

const notifications = [
  { id: 1, type: "message", text: "Алексей написал вам сообщение", time: "2 мин назад", read: false },
  { id: 2, type: "group", text: "Вас добавили в группу «Команда продукта»", time: "15 мин назад", read: false },
  { id: 3, type: "mention", text: "Мария упомянула вас в чате", time: "1 час назад", read: false },
  { id: 4, type: "message", text: "Новое сообщение от HR Поддержки", time: "3 часа назад", read: true },
  { id: 5, type: "system", text: "Аккаунт успешно верифицирован", time: "Вчера", read: true },
  { id: 6, type: "group", text: "Дмитрий покинул группу «Проект А»", time: "2 дня назад", read: true },
];

const settingsGroups = [
  {
    title: "Аккаунт",
    items: [
      { icon: "User", label: "Личные данные" },
      { icon: "Phone", label: "Номер телефона" },
      { icon: "Mail", label: "Электронная почта" },
    ],
  },
  {
    title: "Конфиденциальность",
    items: [
      { icon: "Lock", label: "Пароль и вход" },
      { icon: "Shield", label: "Двухфакторная аутентификация" },
      { icon: "Eye", label: "Кто видит мой профиль" },
    ],
  },
  {
    title: "Уведомления",
    items: [
      { icon: "Bell", label: "Push-уведомления" },
      { icon: "Volume2", label: "Звуки и вибрация" },
    ],
  },
  {
    title: "Внешний вид",
    items: [
      { icon: "Palette", label: "Тема оформления" },
      { icon: "Type", label: "Размер шрифта" },
    ],
  },
];

function Avatar({ name, size = "md", online }: { name: string; size?: "sm" | "md" | "lg"; online?: boolean }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-14 h-14 text-lg" : "w-10 h-10 text-sm";
  const dotSize = size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5";
  const colors = ["bg-stone-200", "bg-zinc-200", "bg-neutral-200", "bg-slate-200", "bg-gray-200"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className="relative flex-shrink-0">
      <div className={`${sizeClass} ${color} rounded-full flex items-center justify-center font-medium text-stone-600`}>
        {initials}
      </div>
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 ${dotSize} rounded-full border-2 border-background ${online ? "bg-emerald-400" : "bg-stone-300"}`}
        />
      )}
    </div>
  );
}

function ChatScreen({ chat, onBack }: { chat: typeof chats[0]; onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>(chatMessages[chat.id] || []);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    setMessages((prev) => [...prev, { id: Date.now(), text, mine: true, time }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full animate-slide-in-right">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-shrink-0">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-colors -ml-1"
        >
          <Icon name="ChevronLeft" size={20} className="text-foreground" />
        </button>
        <Avatar name={chat.name} size="sm" online={chat.online} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight truncate">{chat.name}</p>
          <p className="text-[11px] text-muted-foreground leading-tight">
            {chat.online ? "В сети" : "Не в сети"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-colors">
            <Icon name="Phone" size={16} className="text-muted-foreground" />
          </button>
          <button className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-colors">
            <Icon name="MoreVertical" size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            className={`flex animate-fade-in ${msg.mine ? "justify-end" : "justify-start"}`}
            style={{ animationDelay: `${i * 0.03}s` }}
          >
            <div
              className={`max-w-[72%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                msg.mine
                  ? "bg-foreground text-background rounded-br-sm"
                  : "bg-secondary text-foreground rounded-bl-sm"
              }`}
            >
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-0.5 text-right ${msg.mine ? "text-background/50" : "text-muted-foreground"}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-3 pb-3 pt-2 border-t border-border">
        <div className="flex items-end gap-2">
          <button className="w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center transition-colors flex-shrink-0">
            <Icon name="Paperclip" size={18} className="text-muted-foreground" />
          </button>
          <div className="flex-1 bg-secondary rounded-2xl px-4 py-2.5 flex items-end gap-2 min-h-[40px]">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
              }}
              placeholder="Сообщение..."
              rows={1}
              className="flex-1 bg-transparent text-sm outline-none resize-none placeholder:text-muted-foreground leading-relaxed"
              style={{ maxHeight: "100px" }}
            />
          </div>
          <button
            onClick={send}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-80 flex-shrink-0"
          >
            <Icon name="Send" size={16} className="text-background" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatsTab({ onOpenChat }: { onOpenChat: (chat: typeof chats[0]) => void }) {
  const [search, setSearch] = useState("");
  const filtered = chats.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.message.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="px-4 pb-3 pt-1">
        <div className="flex items-center gap-2.5 bg-secondary rounded-xl px-3.5 py-2.5">
          <Icon name="Search" size={15} className="text-muted-foreground flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск диалогов"
            className="bg-transparent text-sm w-full outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filtered.map((chat, i) => (
          <div
            key={chat.id}
            onClick={() => onOpenChat(chat)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/60 cursor-pointer transition-colors animate-fade-in"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <Avatar name={chat.name} online={chat.online} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-sm font-semibold truncate">{chat.name}</span>
                <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{chat.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground truncate">{chat.message}</span>
                {chat.unread > 0 && (
                  <span className="ml-2 flex-shrink-0 w-5 h-5 bg-foreground text-background text-[10px] font-bold rounded-full flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <Icon name="MessageCircle" size={32} className="mb-2 opacity-30" />
            <p className="text-sm">Ничего не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ContactsTab() {
  const [search, setSearch] = useState("");
  const filtered = contacts.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  const grouped = filtered.reduce<Record<string, typeof contacts>>((acc, c) => {
    const letter = c.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(c);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="px-4 pb-3 pt-1">
        <div className="flex items-center gap-2.5 bg-secondary rounded-xl px-3.5 py-2.5">
          <Icon name="Search" size={15} className="text-muted-foreground flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск контактов"
            className="bg-transparent text-sm w-full outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {Object.entries(grouped).sort().map(([letter, items]) => (
          <div key={letter} className="animate-fade-in">
            <div className="px-4 py-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground tracking-widest">{letter}</span>
            </div>
            {items.map((contact, i) => (
              <div
                key={contact.id}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/60 cursor-pointer transition-colors"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <Avatar name={contact.name} online={contact.online} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">{contact.role}</p>
                </div>
                <button className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-colors">
                  <Icon name="MessageCircle" size={16} className="text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [items, setItems] = useState(notifications);
  const unreadCount = items.filter((n) => !n.read).length;

  const iconMap: Record<string, string> = {
    message: "MessageCircle",
    group: "Users",
    mention: "AtSign",
    system: "CheckCircle",
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {unreadCount > 0 && (
        <div className="px-4 pb-3 pt-1 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{unreadCount} непрочитанных</span>
          <button
            onClick={() => setItems(items.map((n) => ({ ...n, read: true })))}
            className="text-xs font-medium hover:text-muted-foreground transition-colors"
          >
            Прочитать все
          </button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        {items.map((notif, i) => (
          <div
            key={notif.id}
            onClick={() => setItems(items.map((n) => n.id === notif.id ? { ...n, read: true } : n))}
            className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors animate-fade-in ${
              !notif.read ? "bg-secondary/50" : "hover:bg-secondary/30"
            }`}
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              notif.read ? "bg-secondary" : "bg-foreground"
            }`}>
              <Icon
                name={iconMap[notif.type] || "Bell"}
                size={16}
                className={notif.read ? "text-muted-foreground" : "text-background"}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm leading-snug ${!notif.read ? "font-medium" : "text-muted-foreground"}`}>
                {notif.text}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{notif.time}</p>
            </div>
            {!notif.read && (
              <div className="w-2 h-2 rounded-full bg-foreground mt-2 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="flex-1 overflow-y-auto animate-fade-in">
      <div className="px-4 py-3">
        <div className="flex items-center gap-3 bg-card border border-border rounded-2xl p-4 mb-6">
          <Avatar name="Иван Смирнов" size="lg" />
          <div>
            <p className="font-semibold">Иван Смирнов</p>
            <p className="text-xs text-muted-foreground">+7 (900) 123-45-67</p>
          </div>
          <button className="ml-auto w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-colors">
            <Icon name="Pencil" size={15} className="text-muted-foreground" />
          </button>
        </div>
        <div className="space-y-5">
          {settingsGroups.map((group, gi) => (
            <div key={gi} className="animate-fade-in" style={{ animationDelay: `${gi * 0.08}s` }}>
              <p className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase mb-2 px-1">
                {group.title}
              </p>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {group.items.map((item, ii) => (
                  <button
                    key={ii}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left ${
                      ii < group.items.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <Icon name={item.icon} size={17} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">{item.label}</span>
                    <Icon name="ChevronRight" size={15} className="text-muted-foreground ml-auto" />
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="animate-fade-in" style={{ animationDelay: "0.32s" }}>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left text-red-500">
                <Icon name="LogOut" size={17} className="flex-shrink-0" />
                <span className="text-sm font-medium">Выйти из аккаунта</span>
              </button>
            </div>
          </div>
        </div>
        <div className="h-6" />
      </div>
    </div>
  );
}

function AboutTab() {
  return (
    <div className="flex-1 overflow-y-auto animate-fade-in">
      <div className="px-4 py-4 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-foreground rounded-3xl flex items-center justify-center mb-4 mt-2">
          <span className="text-background text-2xl font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>do</span>
        </div>
        <h2 className="text-xl font-bold mb-1">dialog.online</h2>
        <p className="text-sm text-muted-foreground mb-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>Версия 1.0.0</p>
        <p className="text-xs text-muted-foreground mb-6">Сборка 2026.04.26</p>

        <div className="w-full space-y-3 text-left">
          {[
            { icon: "FileText", label: "Условия использования" },
            { icon: "Shield", label: "Политика конфиденциальности" },
            { icon: "HelpCircle", label: "Помощь и поддержка" },
            { icon: "Star", label: "Оценить приложение" },
            { icon: "Share2", label: "Поделиться с друзьями" },
          ].map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl">
              <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/50 transition-colors text-left rounded-2xl">
                <Icon name={item.icon} size={17} className="text-muted-foreground flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
                <Icon name="ChevronRight" size={15} className="text-muted-foreground ml-auto" />
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-8">© 2026 dialog.online</p>
        <p className="text-xs text-muted-foreground">Все права защищены</p>
        <div className="h-4" />
      </div>
    </div>
  );
}

function ProfileTab() {
  const stats = [
    { label: "Чатов", value: "24" },
    { label: "Контактов", value: "138" },
    { label: "Сообщений", value: "4.2к" },
  ];

  return (
    <div className="flex-1 overflow-y-auto animate-fade-in">
      <div className="px-4 py-4">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3">
            <Avatar name="Иван Смирнов" size="lg" online={true} />
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-foreground rounded-full flex items-center justify-center">
              <Icon name="Camera" size={12} className="text-background" />
            </button>
          </div>
          <h2 className="text-lg font-bold">Иван Смирнов</h2>
          <p className="text-sm text-muted-foreground">@ivan_smirnov</p>
          <p className="text-xs text-muted-foreground mt-1">+7 (900) 123-45-67</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-3 text-center">
              <p className="text-lg font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-1">О себе</p>
              <p className="text-sm">Разработчик продуктов 🚀</p>
            </div>
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-1">Статус</p>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <p className="text-sm">В сети</p>
              </div>
            </div>
            <div className="px-4 py-3">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-1">Дата регистрации</p>
              <p className="text-sm">15 января 2024</p>
            </div>
          </div>

          <button className="w-full bg-foreground text-background rounded-2xl py-3.5 text-sm font-semibold hover:opacity-90 transition-opacity">
            Редактировать профиль
          </button>
        </div>
        <div className="h-4" />
      </div>
    </div>
  );
}

const tabs: { id: Tab; icon: string; label: string; badge?: number }[] = [
  { id: "chats", icon: "MessageCircle", label: "Чаты", badge: 8 },
  { id: "contacts", icon: "Users", label: "Контакты" },
  { id: "notifications", icon: "Bell", label: "Центр", badge: 3 },
  { id: "settings", icon: "Settings", label: "Настройки" },
  { id: "about", icon: "Info", label: "О приложении" },
  { id: "profile", icon: "User", label: "Профиль" },
];

const tabTitles: Record<Tab, string> = {
  chats: "Сообщения",
  contacts: "Контакты",
  notifications: "Уведомления",
  settings: "Настройки",
  about: "О приложении",
  profile: "Профиль",
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [openedChat, setOpenedChat] = useState<typeof chats[0] | null>(null);

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div
        className="w-full max-w-sm bg-background rounded-[2.5rem] shadow-2xl shadow-black/10 overflow-hidden flex flex-col"
        style={{ height: "812px", maxHeight: "95vh" }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-4 pb-1 flex-shrink-0">
          <span className="text-xs font-semibold" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>9:41</span>
          <div className="flex items-center gap-1.5">
            <Icon name="Wifi" size={13} className="text-foreground" />
            <Icon name="Battery" size={13} className="text-foreground" />
          </div>
        </div>

        {/* Header — скрываем если открыт чат */}
        {!openedChat && (
          <div className="px-5 pt-2 pb-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">{tabTitles[activeTab]}</h1>
              {activeTab === "chats" && (
                <button className="w-9 h-9 bg-foreground rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                  <Icon name="Pencil" size={15} className="text-background" />
                </button>
              )}
              {activeTab === "contacts" && (
                <button className="w-9 h-9 bg-foreground rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                  <Icon name="UserPlus" size={15} className="text-background" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {openedChat ? (
            <ChatScreen chat={openedChat} onBack={() => setOpenedChat(null)} />
          ) : (
            <>
              {activeTab === "chats" && <ChatsTab onOpenChat={setOpenedChat} />}
              {activeTab === "contacts" && <ContactsTab />}
              {activeTab === "notifications" && <NotificationsTab />}
              {activeTab === "settings" && <SettingsTab />}
              {activeTab === "about" && <AboutTab />}
              {activeTab === "profile" && <ProfileTab />}
            </>
          )}
        </div>

        {/* Bottom Nav — скрываем если открыт чат */}
        {!openedChat && (
          <div className="flex-shrink-0 border-t border-border bg-background/95 px-2 pt-2 pb-5">
            <div className="grid grid-cols-6 gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 py-2 rounded-2xl transition-all ${
                    activeTab === tab.id
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <div className="relative">
                    <Icon name={tab.icon} size={20} />
                    {tab.badge && activeTab !== tab.id && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-foreground text-background text-[9px] font-bold rounded-full flex items-center justify-center">
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] font-medium leading-none">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}