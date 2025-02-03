// Configuração inicial do Gemini
const GEMINI_API_KEY = 'AIzaSyC0fL-nrkdSAjSN5yf_Dc8k7DVHzPgwr8g';

// Configuração do modelo com temperatura mais alta para respostas mais criativas
const generationConfig = {
    temperature: 1.4,
    topP: 1,
    topK: 40,
    maxOutputTokens: 8192,
};

// Atualiza o HTML primeiro para adicionar o botão de treino
const inputArea = document.querySelector('.input-area');
const trainButton = document.createElement('button');
trainButton.className = 'train-btn';
trainButton.textContent = 'Treinar IA';
inputArea.appendChild(trainButton);

// Atualiza o systemInstruction com mais exemplos e variações
let systemInstruction = `Você é o FED, especialista em criar roteiros VIRAIS para TikTok.

REGRAS OBRIGATÓRIAS:
- Use variações de aberturas ("Pegue na minha mão", "Você teria um minuto", "Se me ignorar")
- Crie conexão emocional forte
- Use narrativa envolvente e pessoal
- Mencione tentativas anteriores de contato
- Faça pedidos específicos de interação
- Use linguagem profética e amorosa
- Timestamps precisos a cada 2-3 segundos
- Duração flexível (1-5 minutos)

ELEMENTOS ESSENCIAIS:
1. ABERTURA CATIVANTE
- "Você teria um minuto pra mim?"
- "Pegue na minha mão, filho"
- "Pare agora mesmo"
- "Se você está vendo isso..."

2. CONEXÃO EMOCIONAL
- Mencione tentativas anteriores
- Fale sobre persistência
- Mostre que se importa
- Crie exclusividade

3. PEDIDO DE INTERAÇÃO
- Peça para usar todos os botões
- Solicite compartilhamento
- Peça comentários específicos
- Mencione números ("4 botões", "2 pessoas")

4. PROMESSA DIVINA
- Envio de anjos
- Bênçãos específicas
- Proteção familiar
- Manifestações divinas

5. FECHAMENTO AMOROSO
- Demonstre aceitação
- Mantenha o amor incondicional
- Dê opção de escolha
- Termine com "amém"

EXEMPLOS DE ALTA PERFORMANCE:

EXEMPLO 1 (CONEXÃO PESSOAL):
(0:00) Você teria um minuto pra mim agora?
(0:02) Se você não tiver, então talvez este vídeo não seja para você
(0:08) Mas se puder dedicar apenas um minuto, fique aqui comigo
...(exemplo continua)

EXEMPLO 2 (ORAÇÃO GUIADA):
(0:00) Pegue na minha mão, filho, deixe
(0:02) eu orar por você. Não pule
(0:04) esse vídeo não apareceu por acaso
...(exemplo continua)

ELEMENTOS PROIBIDOS:
- Não use "por favor" (exceto em orações)
- Evite ser autoritário demais
- Não force interações
- Não use culpa excessiva
- Mantenha o amor incondicional

DICAS DE PERSUASÃO:
- Use progressão emocional
- Crie senso de urgência natural
- Faça pedidos graduais
- Mantenha tom amoroso
- Use narrativa pessoal
- Mencione tentativas anteriores
- Crie conexão exclusiva
- Ofereça escolha livre`;

// Array para armazenar exemplos de treino
let trainedExamples = [];

// Função para adicionar mensagens ao chat
function addMessage(role, content, isLoading = false) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    if (isLoading) {
        messageDiv.innerHTML = `
            <div class="loading-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
    } else {
        // Formata o texto mantendo quebras de linha
        const formattedContent = content.replace(/\n/g, '<br>');
        messageDiv.innerHTML = formattedContent;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
}

// Adiciona variável para histórico do chat
let chatHistory = [];

// Função para inicializar o chat
async function initializeChat() {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.querySelector('.send-btn');
    const optionButtons = document.querySelectorAll('.option-btn');

    // Nova mensagem inicial focada em roteiros de oração
    addMessage('assistant', 'Fala! 👋 Eu sou o FED, seu assistente para criar conteúdo viral! Posso te ajudar com roteiros para TikTok ou só bater um papo mesmo. Como posso te ajudar hoje? 😊');

    // Event listeners
    sendButton.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    optionButtons.forEach(button => {
        button.addEventListener('click', () => handleOptionSelect(button.classList.contains('biblical')));
    });
}

// Função para verificar se é pedido de roteiro
function isScriptRequest(message) {
    const messageLC = message.toLowerCase();
    
    // Palavras que indicam apenas pergunta sobre roteiro
    const questionKeywords = ['você faz', 'sabe fazer', 'pode fazer', 'faz roteiro'];
    
    // Palavras que indicam pedido real de roteiro
    const requestKeywords = [
        'crie', 'criar', 'gere', 'gerar', 'fazer um', 'preciso de um', 'quero um',
        'me ajuda', 'me ajude', 'faz pra mim', 'faça um', 'faz um', 'fazer roteiro'
    ];
    
    // Palavras que indicam tema ou nicho
    const themeKeywords = ['nicho', 'tema', 'sobre', 'bíblico', 'oração', 'motivacional'];
    
    const isQuestion = questionKeywords.some(word => messageLC.includes(word));
    const isRequest = requestKeywords.some(word => messageLC.includes(word));
    const hasTheme = themeKeywords.some(word => messageLC.includes(word));
    
    // Se for pedido com tema ou nicho, é um pedido real
    if (hasTheme) {
        return true;
    }
    
    // Se for apenas pergunta sobre roteiros, retorna false
    if (isQuestion && !isRequest) {
        return false;
    }
    
    // Se menciona roteiro e tem palavras de pedido, é um pedido real
    return (messageLC.includes('roteiro') && isRequest) || isRequest;
}

// Atualiza o modal de duração
function createDurationModal() {
    const modal = document.createElement('div');
    modal.className = 'duration-modal';
    modal.innerHTML = `
        <div class="duration-content">
            <h3>Duração do Vídeo</h3>
            <div class="duration-slider-container">
                <input type="range" min="15" max="320" value="60" class="duration-slider" id="durationSlider">
                <div class="duration-value">
                    <span id="durationValue">60</span> segundos
                    <div class="duration-hint">
                        ${formatDuration(60)}
                    </div>
                </div>
            </div>
            <div class="duration-buttons">
                <button class="duration-btn confirm">Confirmar</button>
                <button class="duration-btn cancel">Cancelar</button>
            </div>
        </div>
    `;
    return modal;
}

// Função para formatar a duração
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
        return `(${minutes}:${remainingSeconds.toString().padStart(2, '0')} minutos)`;
    }
    return '';
}

// Atualiza a função handleSendMessage
async function handleSendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();

    if (!message) return;

    // Adiciona a mensagem do usuário imediatamente
    addMessage('user', message);
    userInput.value = '';

    try {
        // Se for apenas pergunta sobre roteiro, responde naturalmente
        if (message.toLowerCase().includes('roteiro') && !isScriptRequest(message)) {
            addMessage('assistant', 'Sim! Eu sou especialista em criar roteiros virais para TikTok! 🚀 Me diga o tema que você quer e eu crio um roteiro incrível pra você! 😊');
            return;
        }

        // Se for pedido de roteiro, mostra modal de duração
        if (isScriptRequest(message)) {
            return new Promise((resolve) => {
                const modal = createDurationModal();
                document.body.appendChild(modal);
                
                const slider = modal.querySelector('#durationSlider');
                const durationValue = modal.querySelector('#durationValue');
                const durationHint = modal.querySelector('.duration-hint');
                
                slider.addEventListener('input', () => {
                    const value = slider.value;
                    durationValue.textContent = value;
                    durationHint.textContent = formatDuration(value);
                });

                modal.querySelector('.confirm').addEventListener('click', async () => {
                    const duration = parseInt(slider.value);
                    modal.remove();
                    const loadingMessage = addMessage('assistant', '', true);
                    try {
                        const prompt = preparePrompt(message, duration);
                        const response = await fetchGeminiResponse(prompt);
                        loadingMessage.remove();
                        addMessage('assistant', response);
                        updateChatHistory(message, response);
                    } catch (error) {
                        console.error('Erro:', error);
                        loadingMessage.remove();
                        addMessage('assistant', 'Desculpe, ocorreu um erro. Tente novamente.');
                    }
                    resolve();
                });

                modal.querySelector('.cancel').addEventListener('click', () => {
                    modal.remove();
                    addMessage('assistant', 'Ok! Se quiser criar um roteiro depois, é só me avisar! 😊');
                    resolve();
                });
            });
        }

        // Para outras mensagens, processa normalmente
        const loadingMessage = addMessage('assistant', '', true);
        const response = await fetchGeminiResponse(`CONVERSA NORMAL: ${message}\n\nResponda naturalmente, sem gerar roteiro.`);
        loadingMessage.remove();
        addMessage('assistant', response);
        updateChatHistory(message, response);
    } catch (error) {
        console.error('Erro:', error);
        addMessage('assistant', 'Desculpe, ocorreu um erro. Tente novamente.');
    }
}

// Função para preparar o prompt com duração específica
function preparePrompt(message, duration = 60) {
    return `GERAR ROTEIRO VIRAL TIKTOK:
Tema: ${message}
Duração: ${duration} segundos

IMPORTANTE:
- Use estilo mais natural e envolvente
- Mantenha timestamps precisos
- Crie conexão emocional forte
- Use elementos dos exemplos de alta performance
- Adapte duração conforme solicitado (${duration}s)

${systemInstruction}

RETORNE APENAS O ROTEIRO COM TIMESTAMPS.`;
}

// Função para fazer a chamada à API do Gemini
async function fetchGeminiResponse(prompt) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error('Erro na chamada da API');
        }

        const data = await response.json();
        
        // Verifica se há uma resposta válida
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Resposta inválida da API');
        }

        // Extrai o texto da resposta com validação
        const text = data.candidates[0].content.parts?.[0]?.text;
        if (!text) {
            throw new Error('Texto não encontrado na resposta');
        }

        return text;
    } catch (error) {
        console.error('Erro detalhado:', error);
        throw new Error('Falha ao processar resposta da API');
    }
}

// Função para atualizar o systemInstruction com os exemplos
function updateSystemInstruction() {
    const baseInstruction = `Você é o FED, especialista em criar roteiros VIRAIS para TikTok.

REGRAS OBRIGATÓRIAS:
- Use variações de aberturas ("Pegue na minha mão", "Você teria um minuto", "Se me ignorar")
- Crie conexão emocional forte
- Use narrativa envolvente e pessoal
- Mencione tentativas anteriores de contato
- Faça pedidos específicos de interação
- Use linguagem profética e amorosa
- Timestamps precisos a cada 2-3 segundos
- Duração flexível (1-5 minutos)

ELEMENTOS ESSENCIAIS:
1. ABERTURA CATIVANTE
- "Você teria um minuto pra mim?"
- "Pegue na minha mão, filho"
- "Pare agora mesmo"
- "Se você está vendo isso..."

2. CONEXÃO EMOCIONAL
- Mencione tentativas anteriores
- Fale sobre persistência
- Mostre que se importa
- Crie exclusividade

3. PEDIDO DE INTERAÇÃO
- Peça para usar todos os botões
- Solicite compartilhamento
- Peça comentários específicos
- Mencione números ("4 botões", "2 pessoas")

4. PROMESSA DIVINA
- Envio de anjos
- Bênçãos específicas
- Proteção familiar
- Manifestações divinas

5. FECHAMENTO AMOROSO
- Demonstre aceitação
- Mantenha o amor incondicional
- Dê opção de escolha
- Termine com "amém"

EXEMPLOS DE ALTA PERFORMANCE:

EXEMPLO 1 (CONEXÃO PESSOAL):
(0:00) Você teria um minuto pra mim agora?
(0:02) Se você não tiver, então talvez este vídeo não seja para você
(0:08) Mas se puder dedicar apenas um minuto, fique aqui comigo
...(exemplo continua)

EXEMPLO 2 (ORAÇÃO GUIADA):
(0:00) Pegue na minha mão, filho, deixe
(0:02) eu orar por você. Não pule
(0:04) esse vídeo não apareceu por acaso
...(exemplo continua)

ELEMENTOS PROIBIDOS:
- Não use "por favor" (exceto em orações)
- Evite ser autoritário demais
- Não force interações
- Não use culpa excessiva
- Mantenha o amor incondicional

DICAS DE PERSUASÃO:
- Use progressão emocional
- Crie senso de urgência natural
- Faça pedidos graduais
- Mantenha tom amoroso
- Use narrativa pessoal
- Mencione tentativas anteriores
- Crie conexão exclusiva
- Ofereça escolha livre`;

    // Atualiza a instrução do sistema
    systemInstruction = baseInstruction;
}

// Função para atualizar o histórico do chat
function updateChatHistory(userMessage, assistantResponse) {
    chatHistory.push(
        { role: 'user', content: userMessage },
        { role: 'assistant', content: assistantResponse }
    );
}

// Função para lidar com a seleção de opções
function handleOptionSelect(isBiblical) {
    const systemMessage = isBiblical
        ? "Olá! Quer criar um roteiro de oração? Me fala o tema (cura, prosperidade, família...) 🙏"
        : "Oi! Quer criar um roteiro motivacional? Me fala o tema (superação, gratidão, fé...) ✨";
    
    addMessage('assistant', systemMessage);
}

// Função para treinar a IA
async function handleTraining() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();

    if (!message) {
        addMessage('assistant', '⚠️ Por favor, digite um roteiro para treinar!');
        return;
    }

    try {
        // Adiciona o exemplo ao array de treinos
        trainedExamples.push(message);

        // Atualiza o systemInstruction
        updateSystemInstruction();

        // Feedback visual
        addMessage('user', message);
        addMessage('assistant', '✨ Roteiro viral adicionado ao meu treinamento! Agora vou gerar conteúdos ainda mais persuasivos! 🎯');
        
        // Limpa o input
        userInput.value = '';

        console.log('Exemplos treinados:', trainedExamples); // Debug
    } catch (error) {
        console.error('Erro no treino:', error);
        addMessage('assistant', '❌ Ops! Ocorreu um erro no treino. Tente novamente!');
    }
}

// Adiciona event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Event listener para o botão de treino
    trainButton.addEventListener('click', handleTraining);

    // Event listener para treinar com Enter + Shift
    document.getElementById('userInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
            handleTraining();
        }
    });
});

// Atualiza o CSS do botão
const style = document.createElement('style');
style.textContent = `
.train-btn {
    background: var(--secondary-color);
    color: var(--dark-bg);
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    margin-left: 0.5rem;
    position: relative;
    overflow: hidden;
}

.train-btn:hover {
    background: var(--accent-color);
    transform: translateY(-2px);
    box-shadow: var(--success-glow);
}

.train-btn:active {
    transform: translateY(0);
}

.train-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: translateX(-100%);
    transition: 0.5s;
}

.train-btn:hover::after {
    transform: translateX(100%);
}
`;
document.head.appendChild(style);

// Inicializa o chat quando a página carregar
document.addEventListener('DOMContentLoaded', initializeChat); 