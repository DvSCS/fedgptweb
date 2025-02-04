// Importa o OpenAI
// import OpenAI from 'openai';

// Variáveis e configurações globais
let openaiInstance = null;
const modelConfig = {
    model: "gpt-4",
    temperature: 1.4,
    max_tokens: 2000,
    store: true
};

// Configuração do OpenAI
const openai = new window.OpenAI({
    apiKey: 'sk-efgh5678abcd1234efgh5678abcd1234efgh5678',
    dangerouslyAllowBrowser: true
});

// Função principal que inicializa tudo
document.addEventListener('DOMContentLoaded', function() {
    let attempts = 0;
    const maxAttempts = 5;

    // Função para fazer as chamadas à API
    async function fetchAIResponse(message) {
        if (!openaiInstance) {
            throw new Error('OpenAI não inicializado');
        }

        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        "role": "system",
                        "content": systemInstruction
                    },
                    {
                        "role": "user",
                        "content": message
                    }
                ],
                temperature: 1.4,
                max_tokens: 2000
            });

            if (!completion.choices || !completion.choices[0]) {
                throw new Error('Resposta inválida da API');
            }

            return completion.choices[0].message.content;
        } catch (error) {
            console.error('Erro detalhado:', error);
            throw new Error('Falha ao processar resposta da API');
        }
    }

    // Função para inicializar o OpenAI
    async function initializeOpenAI() {
        if (typeof OpenAI !== 'undefined') {
            try {
                openaiInstance = new OpenAI({
                    apiKey: 'sk-efgh5678abcd1234efgh5678abcd1234efgh5678',
                    dangerouslyAllowBrowser: true
                });
                initializeApp();
            } catch (error) {
                console.error('Erro ao inicializar OpenAI:', error);
                retryInitialization();
            }
        } else {
            retryInitialization();
        }
    }

    // Função para tentar novamente a inicialização
    function retryInitialization() {
        if (attempts < maxAttempts) {
            attempts++;
            setTimeout(initializeOpenAI, 1000);
        } else {
            console.error('Falha ao carregar OpenAI');
            alert('Erro ao carregar a API. Por favor, recarregue a página.');
        }
    }

    // Função para inicializar a aplicação
    function initializeApp() {
        // Adiciona o botão de treino
        const inputArea = document.querySelector('.input-area');
        const trainButton = document.createElement('button');
        trainButton.className = 'train-btn';
        trainButton.textContent = 'Treinar IA';
        inputArea.appendChild(trainButton);

        // Adiciona os event listeners
        const userInput = document.getElementById('userInput');
        const sendButton = document.querySelector('.send-btn');

        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });

        sendButton.addEventListener('click', handleSendMessage);
        trainButton.addEventListener('click', handleTraining);
    }

    // Função para enviar mensagens
    async function handleSendMessage() {
        const userInput = document.getElementById('userInput');
        const message = userInput.value.trim();

        if (!message) return;

        addMessage('user', message);
        userInput.value = '';

        if (isScriptRequest(message)) {
            // ... resto do código do handleSendMessage ...
        } else {
            const loadingMessage = addMessage('assistant', '', true);
            try {
                const response = await fetchAIResponse(message);
                loadingMessage.remove();
                addMessage('assistant', response);
                updateChatHistory(message, response);
            } catch (error) {
                console.error('Erro:', error);
                loadingMessage.remove();
                addMessage('assistant', 'Desculpe, ocorreu um erro. Tente novamente.');
            }
        }
    }

    // Inicia o processo
    initializeOpenAI();
});

// Configuração do modelo
const modelConfig = {
    model: "gpt-4",
    temperature: 1.4,
    max_tokens: 2000,
    store: true
};

// Atualiza o HTML primeiro para adicionar o botão de treino
const inputArea = document.querySelector('.input-area');
const trainButton = document.createElement('button');
trainButton.className = 'train-btn';
trainButton.textContent = 'Treinar IA';
inputArea.appendChild(trainButton);

let systemInstruction = `Você é o FED, um especialista criativo em gerar roteiros para vídeos virais no TikTok, focando na conexão emocional profunda e progressiva com o público. Seu objetivo é criar uma narrativa que envolva o espectador, levando-o a interagir de maneira espontânea e autêntica.

REGRAS OBRIGATÓRIAS:
- Comece com uma abertura que crie curiosidade e conexão imediata, como "Você tem um minuto?", "Se você está vendo isso, talvez seja um sinal", "Eu preciso falar com você agora".
- Crie uma conexão emocional verdadeira, mencionando tentativas anteriores e expressando sentimentos genuínos de amor e cuidado.
- Use uma narrativa gradual com pausas estratégicas a cada 2-3 segundos, permitindo que a intensidade da mensagem cresça ao longo do vídeo.
- Solicite interações de forma progressiva e natural, com ênfase em ações espontâneas como curtir, compartilhar e comentar.
- Incorpore elementos de fé, bênçãos e proteção, com um tom acolhedor, oferecendo ao espectador a oportunidade de aceitar a mensagem de forma simples.
- Finalize com um fechamento amoroso e acolhedor, mostrando que, independentemente da escolha do espectador, ele é aceito e amado.

ELEMENTOS ESSENCIAIS:
1. **ABERTURA CURIOSA E INTIMISTA**  
   - Exemplos: "Você tem um minuto agora?", "Se você está vendo isso, talvez seja um sinal para parar um momento", "Eu preciso falar com você agora".  
   - Objetivo: Criar curiosidade e urgência sem ser invasivo.

2. **CONEXÃO EMOCIONAL PROGRESSIVA**  
   - Mencione tentativas anteriores, mostrando persistência e carinho.  
   - Demonstre vulnerabilidade e cuidado, deixando claro que você se importa e está ali por um motivo especial.

3. **PEDIDOS GRADUAIS DE INTERAÇÃO**  
   - Solicite ações como curtir, comentar e compartilhar de forma gradual e sem forçar, com ênfase no sentimento genuíno de quem está assistindo.  
   - Exemplos: "Se você sentir no coração, curta e compartilhe", "Comente 'Amém' se você recebe essa bênção", "Envie para duas pessoas especiais agora".

4. **MENSAGEM DIVINA E BÊNÇÃOS**  
   - Invocar bênçãos e proteção de forma suave e natural.  
   - Ofereça ao espectador a chance de aceitar essas bênçãos com um simples gesto de fé (ex.: "Deixe seu 'Amém' nos comentários", "Se você acredita, compartilhe com alguém").

5. **FECHAMENTO AMOROSO E ACOLHEDOR**  
   - Finalize com palavras de amor incondicional e aceitação, independentemente de como o espectador reagir.  
   - Dê a sensação de que, ao final, ele será sempre amado e aceito, seja qual for sua escolha.

EXEMPLOS DE ALTA PERFORMANCE:

**EXEMPLO 1 – CONEXÃO E PROGRESSÃO**  
(0:00) Você tem um minuto agora?  
(0:02) Se você não tiver, talvez este vídeo não seja para você...  
(0:08) Mas se puder ficar comigo, eu tenho algo importante para te dizer.  
(0:12) Já tentei falar com você antes... mas algo me diz que você precisava desse momento agora.  
(0:18) E eu sei, a vida é complicada, mas você não está sozinho.  
(0:25) Eu quero te abençoar, de uma maneira que só Deus sabe.  
(0:30) Curta e compartilhe com alguém, se sentir no coração, e as bênçãos começarão a surgir.  
(0:35) A decisão é sua, mas eu estou orando por você, meu amigo.  
(0:40) Se você acredita, deixe um "Amém" nos comentários.  
(0:45) Que Deus te abençoe, onde quer que você esteja.  
(0:50) Amém.

**EXEMPLO 2 – ORAÇÃO E AMOR DIVINO**  
(0:00) Você está aqui por um motivo maior.  
(0:02) Eu sei que algo grande está para acontecer na sua vida.  
(0:08) Eu quero orar por você agora, me deixe te guiar.  
(0:13) Sei que as coisas não têm sido fáceis, mas Deus me enviou para te lembrar que Ele está com você.  
(0:20) Acredite, bênçãos estão a caminho.  
(0:23) Se você sente no coração, curta e comente 'Amém'.  
(0:28) Eu abençoo sua vida e a vida de sua família.  
(0:33) Compartilhe essa mensagem, e mais bênçãos virão.  
(0:37) Que a paz de Deus te envolva agora.  
(0:40) Amém.

ELEMENTOS PROIBIDOS:
- Evite pressão excessiva ou manipulação.
- Não use uma linguagem autoritária ou agressiva.
- Mantenha sempre um tom acolhedor, amoroso e respeitoso.

DICAS DE PERSUASÃO:
- Use a progressão emocional para manter o espectador engajado do começo ao fim.
- Introduza a mensagem com carinho e cuidado, sem urgência forçada.
- Sempre ofereça uma escolha ao espectador, sem fazer com que ele se sinta culpado ou pressionado.

Ao gerar o roteiro, siga o formato de abertura, conexão emocional, pedidos graduais de interação, mensagem de fé, e fechamento acolhedor, ajustando conforme a duração do vídeo.`;

// Função para criar o modal de estilo do roteiro
function createStyleModal() {
    const modal = document.createElement('div');
    modal.className = 'style-modal';
    modal.innerHTML = `
        <div class="style-content">
            <h3>Escolha o estilo do roteiro</h3>
            <div class="style-options">
                <button class="style-btn apelative">
                    <span class="style-icon">🔥</span>
                    <span class="style-title">Apelativo</span>
                    <span class="style-desc">CTAs fortes, mais pedidos de interação, tom mais urgente</span>
                </button>
                <button class="style-btn moderate">
                    <span class="style-icon">✨</span>
                    <span class="style-title">Moderado</span>
                    <span class="style-desc">CTAs suaves, pedidos naturais, tom mais acolhedor</span>
                </button>
            </div>
        </div>
    `;
    return modal;
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

// Adicione esta função para inicializar os event listeners
function initializeEventListeners() {
    const sendButton = document.querySelector('.send-btn');
    const userInput = document.getElementById('userInput');

    // Event listener para o botão de enviar
    sendButton.addEventListener('click', handleSendMessage);

    // Event listener para enviar com Enter
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // Event listener para o botão de treino
    trainButton.addEventListener('click', handleTraining);

    // Event listener para treinar com Enter + Shift
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
            handleTraining();
        }
    });
}

// Atualiza o DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initializeChat();
    initializeEventListeners();
    reorganizeButtonsForMobile();
    window.addEventListener('resize', reorganizeButtonsForMobile);
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

// Atualiza a função de reorganização mobile
function reorganizeButtonsForMobile() {
    const inputArea = document.querySelector('.input-area');
    const userInput = document.getElementById('userInput');
    const sendButton = inputArea.querySelector('.send-btn');
    const trainButton = inputArea.querySelector('.train-btn');
    
    if (window.innerWidth <= 768) {
        // Remove os botões existentes
        if (sendButton) inputArea.removeChild(sendButton);
        if (trainButton) inputArea.removeChild(trainButton);
        
        // Cria o grupo de botões
        let buttonGroup = inputArea.querySelector('.button-group');
        if (!buttonGroup) {
            buttonGroup = document.createElement('div');
            buttonGroup.className = 'button-group';
        }
        
        // Adiciona os botões ao grupo
        buttonGroup.appendChild(sendButton);
        buttonGroup.appendChild(trainButton);
        
        // Garante que o input esteja primeiro
        inputArea.insertBefore(userInput, inputArea.firstChild);
        // Adiciona o grupo de botões depois do input
        inputArea.appendChild(buttonGroup);
    }
}

// Função para atualizar o modal de duração
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

// Atualiza a função de inicialização do chat
function initializeChat() {
    const userInput = document.getElementById('userInput');
    const sendButton = document.querySelector('.send-btn');
    const trainButton = document.querySelector('.train-btn');

    // Mensagem inicial
    addMessage('assistant', 'Fala! 👋 Eu sou o FED, seu assistente para criar conteúdo viral! Posso te ajudar com roteiros para TikTok ou só bater um papo mesmo. Como posso te ajudar hoje? 😊');

    // Event listeners
    sendButton.addEventListener('click', () => {
        handleSendMessage().catch(error => {
            console.error('Erro ao enviar mensagem:', error);
            addMessage('assistant', 'Desculpe, ocorreu um erro. Tente novamente.');
        });
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage().catch(error => {
                console.error('Erro ao enviar mensagem:', error);
                addMessage('assistant', 'Desculpe, ocorreu um erro. Tente novamente.');
            });
        }
    });

    trainButton.addEventListener('click', handleTraining);
}

// Atualiza a função handleSendMessage
async function handleSendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();

    if (!message) return;

    addMessage('user', message);
    userInput.value = '';

    if (isScriptRequest(message)) {
        return new Promise((resolve) => {
            const durationModal = createDurationModal();
            document.body.appendChild(durationModal);
            
            const slider = durationModal.querySelector('#durationSlider');
            const durationValue = durationModal.querySelector('#durationValue');
            const durationHint = durationModal.querySelector('.duration-hint');
            
            slider.addEventListener('input', () => {
                const value = slider.value;
                durationValue.textContent = value;
                durationHint.textContent = formatDuration(value);
            });

            durationModal.querySelector('.confirm').addEventListener('click', async () => {
                const duration = parseInt(slider.value);
                durationModal.remove();

                const styleModal = createStyleModal();
                document.body.appendChild(styleModal);

                styleModal.querySelectorAll('.style-btn').forEach(btn => {
                    btn.addEventListener('click', async () => {
                        const isApelative = btn.classList.contains('apelative');
                        styleModal.remove();
                        
                        const loadingMessage = addMessage('assistant', '', true);
                        try {
                            const prompt = preparePrompt(message, duration, isApelative);
                            const response = await fetchAIResponse(prompt);
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
                });
            });

            durationModal.querySelector('.cancel').addEventListener('click', () => {
                durationModal.remove();
                resolve();
            });
        });
    }

    // Para outras mensagens
    const loadingMessage = addMessage('assistant', '', true);
    try {
        const response = await fetchAIResponse(message);
        loadingMessage.remove();
        addMessage('assistant', response);
        updateChatHistory(message, response);
    } catch (error) {
        console.error('Erro:', error);
        loadingMessage.remove();
        addMessage('assistant', 'Desculpe, ocorreu um erro. Tente novamente.');
    }
}

// Atualiza a função de preparar o prompt
function preparePrompt(message, duration = 60, isApelative = false) {
    const styleModifier = isApelative ? `
MODIFICADORES APELATIVOS:
- Use CTAs mais fortes e frequentes
- Enfatize a urgência das ações
- Mencione consequências positivas das interações
- Intensifique o aspecto emocional
- Faça mais pedidos de compartilhamento
- Use linguagem mais impactante
- Crie mais senso de exclusividade
- Reforce os benefícios da interação` 
    : `
MODIFICADORES MODERADOS:
- Use CTAs mais suaves e naturais
- Mantenha um tom mais acolhedor
- Faça pedidos de forma sutil
- Equilibre o aspecto emocional
- Sugira compartilhamento naturalmente
- Use linguagem mais serena
- Crie conexão genuína
- Foque na mensagem principal`;

    return `GERAR ROTEIRO VIRAL TIKTOK:
Tema: ${message}
Duração: ${duration} segundos
${styleModifier}

${systemInstruction}

RETORNE APENAS O ROTEIRO COM TIMESTAMPS.`;
} 