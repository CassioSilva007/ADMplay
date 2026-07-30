// --- 1. ESTADO DO JOGO (MODELO) ---
    const JOGO = {
        orcamento: 1500.00,
        despesas: 0.00,
        satisfacao: 100,
        precoPizza: 50,
        custoBasePorPizza: 7,
        dia: 1,
        rank: 1,
        score: 0,
        idContador: 1,
        velocidadeForno: 10000,
        tempoGeracaoPedido: 12000,
        pedidos: [],
        limitePedidosDia: 7,
        pedidosHoje: 0,

        // ————— ESTOQUE INICIAL (OPÇÃO A) —————
        estoque: {
            massa:      { nome: "Massa Tradicional", quantidade: 10, custo: 5, key: 'massa' },
            molho:      { nome: "Molho Marinara", quantidade: 10, custo: 4, key: 'molho' },
            queijo:     { nome: "Queijo Mussarela", quantidade: 10, custo: 6, key: 'queijo' },
            pepperoni:  { nome: "Pepperoni", quantidade: 5,  custo: 8, key: 'pepperoni' },
            cogumelos:  { nome: "Cogumelos", quantidade: 5,  custo: 7, key: 'cogumelos' },
            cebola:     { nome: "Cebolas", quantidade: 5,  custo: 3, key: 'cebola' },
        },

        // ————— BANCO DE INGREDIENTES COMPLETO —————
        ingredientesDB: {
            crostas: [
                "Massa Tradicional",
                "Crosta Crocante",
                "Crosta Grossa",
                "Crosta de Nó de Alho",
                "Crosta de Couve-flor"
            ],
            molhos: [
                "Molho Marinara",
                "Molho Buffalo",
                "Marinara Clássica",
                "Romana Rústica",
                "Molho cremoso de alho",
                "Molho Ranch",
                "Molho Barbecue",
                "Azeite de oliva"
            ],
            queijos: [
                "Queijo Mussarela",
                "Queijo Provolone",
                "Queijo Cheddar",
                "Queijo Parmesão"
            ],
            coberturas: [
                "Pimentões verdes",
                "Cogumelos",
                "Cebolas",
                "Pepperoni",
                "Salsicha",
                "Tomate",
                "Bacon",
                "Presunto",
                "Azeitonas Pretas"
            ]
        },

        pedidoEmPreparo: null,

        timers: {
            geracao: null
        }
    };


    const ICONES_INGREDIENTES = {

        /* ======= CROSTAS ======= */
        "Massa Tradicional": {
            icon: `
            <svg viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="24" fill="#f4cc8a" stroke="#000" stroke-width="4"/>
                <circle cx="32" cy="32" r="16" fill="#f9e4bf"/>
                <circle cx="26" cy="28" r="3" fill="#e5b679"/>
                <circle cx="38" cy="36" r="3" fill="#e5b679"/>
            </svg>`,
            cor: "ing-massa-tradicional"
        },
        "Crosta Crocante": {
            icon: `
            <svg viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="24" fill="#e0a65f" stroke="#000" stroke-width="4"/>
                <circle cx="32" cy="32" r="18" fill="#f2c98a"/>
                <circle cx="32" cy="32" r="10" fill="#f7deb1"/>
            </svg>`,
            cor: "ing-crosta-crocante"
        },
        "Crosta Grossa": {
            icon: `
            <svg viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="#d7974f" stroke="#000" stroke-width="4"/>
                <circle cx="32" cy="32" r="16" fill="#f7d9a8"/>
            </svg>`,
            cor: "ing-crosta-grossa"
        },
        "Crosta de Nó de Alho": {
            icon: `
            <svg viewBox="0 0 64 64">
                <path d="M20 42 C8 32, 12 20, 30 22 C48 24, 54 34, 42 46 C34 54, 24 52, 20 42Z"
                    fill="#f3d19f" stroke="#000" stroke-width="4"/>
                <circle cx="30" cy="26" r="4" fill="#fff6e0"/>
            </svg>`,
            cor: "ing-crosta-no-alho"
        },
        "Crosta de Couve-flor": {
            icon: `
            <svg viewBox="0 0 64 64">
                <ellipse cx="32" cy="36" rx="22" ry="14" fill="#e7f3cf" stroke="#000" stroke-width="4"/>
                <circle cx="24" cy="32" r="6" fill="#fafdf0"/>
                <circle cx="40" cy="34" r="6" fill="#fafdf0"/>
            </svg>`,
            cor: "ing-crosta-couve"
        },

        /* ======= MOLHOS ======= */
        "Molho Buffalo": {
            icon: `
            <svg viewBox="0 0 64 64">
                <circle cx="32" cy="36" r="18" fill="#ff6a2c" stroke="#000" stroke-width="4"/>
                <circle cx="28" cy="34" r="5" fill="#ff8a57"/>
            </svg>`,
            cor: "ing-buffalo"
        },
        "Molho Marinara": {
            icon: `
            <svg viewBox="0 0 64 64">
                <circle cx="32" cy="36" r="18" fill="#d62828" stroke="#000" stroke-width="4"/>
                <circle cx="28" cy="32" r="4" fill="#ff6b6b"/>
                <circle cx="40" cy="38" r="3" fill="#ff6b6b"/>
            </svg>`,
            cor: "ing-marinara"
        },
        "Marinara Clássica": {
            icon: `
            <svg viewBox="0 0 64 64">
                <circle cx="32" cy="34" r="18" fill="#c1272d" stroke="#000" stroke-width="4"/>
                <circle cx="26" cy="30" r="4" fill="#e74c3c"/>
            </svg>`,
            cor: "ing-marinara-classica"
        },
        "Romana Rústica": {
            icon: `
            <svg viewBox="0 0 64 64">
                <rect x="14" y="20" width="36" height="26" rx="8"
                    fill="#a83232" stroke="#000" stroke-width="4"/>
                <rect x="20" y="26" width="24" height="12" rx="4" fill="#d9534f"/>
            </svg>`,
            cor: "ing-romana"
        },
        "Molho cremoso de alho": {
            icon: `
            <svg viewBox="0 0 64 64">
                <circle cx="32" cy="34" r="18" fill="#f8f4e3" stroke="#000" stroke-width="4"/>
                <ellipse cx="30" cy="34" rx="6" ry="4" fill="#e7dfc9"/>
            </svg>`,
            cor: "ing-molho-alho"
        },
        "Molho Ranch": {
            icon: `
            <svg viewBox="0 0 64 64">
                <rect x="18" y="18" width="28" height="30" rx="8"
                    fill="#f4faff" stroke="#000" stroke-width="4"/>
                <circle cx="32" cy="36" r="5" fill="#d8e6f0"/>
            </svg>`,
            cor: "ing-ranch"
        },
        "Molho Barbecue": {
            icon: `
            <svg viewBox="0 0 64 64">
                <circle cx="32" cy="36" r="18" fill="#5a2d17" stroke="#000" stroke-width="4"/>
                <circle cx="28" cy="34" r="5" fill="#7a3a22"/>
            </svg>`,
            cor: "ing-bbq"
        },
        "Azeite de oliva": {
            icon: `
            <svg viewBox="0 0 64 64">
                <ellipse cx="32" cy="36" rx="18" ry="12" fill="#d4cc2c" stroke="#000" stroke-width="4"/>
                <ellipse cx="30" cy="34" rx="6" ry="4" fill="#f0e85a"/>
            </svg>`,
            cor: "ing-azeite"
        },

        /* ======= QUEIJOS ======= */
        "Queijo Mussarela": {
            icon: `
            <svg viewBox="0 0 64 64">
                <rect x="12" y="20" width="40" height="26" rx="8"
                    fill="#fff7c4" stroke="#000" stroke-width="4"/>
                <circle cx="24" cy="32" r="4" fill="#e6d88f"/>
                <circle cx="40" cy="28" r="3" fill="#e6d88f"/>
            </svg>`,
            cor: "ing-mucarela"
        },
        "Queijo Provolone": {
            icon: `
            <svg viewBox="0 0 64 64">
                <ellipse cx="32" cy="32" rx="20" ry="14" fill="#ffe099" stroke="#000" stroke-width="4"/>
                <ellipse cx="32" cy="32" rx="10" ry="6" fill="#ffd27f"/>
            </svg>`,
            cor: "ing-provolone"
        },
        "Queijo Cheddar": {
            icon: `
            <svg viewBox="0 0 64 64">
                <rect x="10" y="24" width="44" height="20" rx="8"
                    fill="#ffa726" stroke="#000" stroke-width="4"/>
                <rect x="20" y="30" width="24" height="8" fill="#ffbf69"/>
            </svg>`,
            cor: "ing-cheddar"
        },
        "Queijo Parmesão": {
            icon: `
            <svg viewBox="0 0 64 64">
                <polygon points="12,50 32,14 52,50"
                        fill="#ffe9a8" stroke="#000" stroke-width="4"/>
                <polygon points="28,42 32,34 36,42" fill="#f7d98f"/>
            </svg>`,
            cor: "ing-parmesao"
        },

        /* ======= COBERTURAS ======= */
        "Pimentões verdes": {
            icon: `
            <svg viewBox="0 0 64 64">
                <rect x="18" y="22" width="28" height="20" rx="10"
                    fill="#3fae32" stroke="#000" stroke-width="4"/>
                <rect x="28" y="16" width="8" height="6" rx="3" fill="#2d7b22" stroke="#000" stroke-width="3"/>
            </svg>`,
            cor: "ing-pimentao"
        },
        "Cogumelos": {
            icon: `
            <svg viewBox="0 0 64 64">
                <ellipse cx="32" cy="26" rx="22" ry="14" fill="#f3e5c8" stroke="#000" stroke-width="4"/>
                <rect x="24" y="26" width="16" height="20" rx="10" fill="#e2d5bb" stroke="#000" stroke-width="3"/>
                <ellipse cx="32" cy="22" rx="8" ry="4" fill="#ffffff66"/>
            </svg>`,
            cor: "ing-cogumelos"
        },
        "Cebolas": {
            icon: `
            <svg viewBox="0 0 64 64">
                <ellipse cx="32" cy="36" rx="20" ry="16" fill="#efd8ff" stroke="#000" stroke-width="4"/>
                <ellipse cx="32" cy="34" rx="12" ry="8" fill="#d3b0ff"/>
                <ellipse cx="32" cy="32" rx="6" ry="3" fill="#ffffff88"/>
            </svg>`,
            cor: "ing-cebola"
        },
        "Pepperoni": {
            icon: `
            <svg viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="16" fill="#b02828" stroke="#000" stroke-width="4"/>
                <circle cx="28" cy="30" r="4" fill="#d94c4c"/>
                <circle cx="36" cy="34" r="3" fill="#d94c4c"/>
            </svg>`,
            cor: "ing-pepperoni"
        },
        "Salsicha": {
            icon: `
            <svg viewBox="0 0 64 64">
                <rect x="14" y="26" width="36" height="12" rx="6"
                    fill="#c4635c" stroke="#000" stroke-width="4"/>
                <rect x="20" y="28" width="24" height="6" fill="#d97a72"/>
            </svg>`,
            cor: "ing-salsicha"
        },
        "Tomate": {
            icon: `
            <svg viewBox="0 0 64 64">
                <circle cx="32" cy="34" r="18" fill="#ff3b30" stroke="#000" stroke-width="4"/>
                <path d="M26 14 C32 6, 42 6, 38 18" fill="#3fae32" stroke="#000" stroke-width="4"/>
                <circle cx="28" cy="32" r="6" fill="#ff766e"/>
            </svg>`,
            cor: "ing-tomate"
        },
        "Bacon": {
            icon: `
            <svg viewBox="0 0 64 64">
                <path d="M12 26 C24 18, 40 42, 52 34 
                        L52 44 C40 52, 24 28, 12 36 Z"
                    fill="#d97a63" stroke="#000" stroke-width="4"/>
                <path d="M14 30 C24 24, 38 46, 50 40"
                    stroke="#ffd5c7" stroke-width="4" fill="none"/>
            </svg>`,
            cor: "ing-bacon"
        },
        "Presunto": {
            icon: `
            <svg viewBox="0 0 64 64">
                <ellipse cx="32" cy="36" rx="20" ry="14" fill="#ffb7c5" stroke="#000" stroke-width="4"/>
                <ellipse cx="32" cy="36" rx="8" ry="5" fill="#ff8ea5"/>
            </svg>`,
            cor: "ing-presunto"
        },
            "Azeitonas Pretas": {
            icon: `
            <svg viewBox="0 0 64 64">
                <ellipse cx="32" cy="34" rx="14" ry="20" fill="#1b1b1b" stroke="#000" stroke-width="4"/>
                <ellipse cx="32" cy="34" rx="6" ry="10" fill="#3b3b3b"/>
            </svg>`,
            cor: "ing-azeitona-preta"
        },
    };

    const INGREDIENTES_POR_RANK = {
        2: [
            "Crosta Crocante",
            "Molho Buffalo",
            "Marinara Clássica",
            "Queijo Provolone",
            "Pimentões verdes",
            "Tomate"
        ],
        3: [
            "Crosta Grossa",
            "Romana Rústica",
            "Molho cremoso de alho",
            "Queijo Cheddar",
            "Salsicha",
            "Presunto"
        ],
        4: [
            "Crosta de Nó de Alho",
            "Molho Ranch",
            "Molho Barbecue",
            "Queijo Parmesão",
            "Bacon",
            "Azeitonas Pretas"
        ],
        5: [
            "Crosta de Couve-flor",
            "Azeite de oliva"
        ]
    };

    function desbloquearIngredientesPorRank(rank) {
        if (!INGREDIENTES_POR_RANK[rank]) return;

        const novos = INGREDIENTES_POR_RANK[rank];

        novos.forEach(nome => {
            // evitar duplicar
            const existe = Object.values(JOGO.estoque).some(i => i.nome === nome);
            if (existe) return;

            // criar key automática
            const key = nome.toLowerCase().replace(/\s+/g, '_').replace(/[^\w]/g, '');
            
            // criar no estoque
            JOGO.estoque[key] = {
                nome: nome,
                quantidade: 5,
                custo: 6,
                key: key
            };

            log(`⭐ NOVO INGREDIENTE DESBLOQUEADO (RANK ${rank}): <strong>${nome}</strong>`);
        });

        renderizarEstoque();
    }


    function getIconeIngrediente(nome, isSelected = false) {
        const item = ICONES_INGREDIENTES[nome];
        if (!item) return { html: `<span>${nome.charAt(0)}</span>`, cor: 'background: #9ca3af;' };
        return { html: item.icon, classe: item.cor };
    }

    const DOM = {
        hud: {
            dia: document.getElementById('hud-dia'),
            rank: document.getElementById('hud-rank'),
            orcamento: document.getElementById('hud-orcamento'),
            satisfacao: document.getElementById('hud-satisfacao'),
            preco: document.getElementById('hud-preco')
        },
        stats: {
            score: document.getElementById('stat-score'),
            despesas: document.getElementById('stat-despesas'),
        },
        btnUpgradeForno: document.getElementById('btn-upgrade-forno'),
        estoqueList: document.getElementById('estoque-list'),
        tempoForno: document.getElementById('tempo-forno'),
        logs: document.getElementById('logs'),
        areas: {
            fila: document.getElementById('fila-pedidos'),
            preparo: document.getElementById('area-preparo'),
            forno: document.getElementById('forno'),
            entrega: document.getElementById('area-entrega'),
        },
        modal: {
            overlay: document.getElementById('modal-preparo'),
            titulo: document.getElementById('modal-titulo-pedido'),
            receita: document.getElementById('modal-receita'),
            montagem: document.getElementById('modal-montagem-atual'),
            ingredientes: document.getElementById('modal-ingredientes'),
            btnConfirmar: document.getElementById('modal-btn-confirmar'),
            btnCancelar: document.getElementById('modal-btn-cancelar'),
        }
    };

    // --- FUNÇÕES DE ACESSIBILIDADE ---

    function toggleAccMenu() {
        const menu = document.getElementById('accMenu');
        menu.classList.toggle('ativo');
    }

    function toggleGroup(header) {
        header.parentElement.classList.toggle('open');
    }

    function toggleContrast() {
        document.body.classList.toggle('high-contrast');
    }

    function toggleAnimation() {
        document.body.classList.toggle('no-animation');
    }

    function toggleFont() {
        document.body.classList.toggle('large-font');
    }

    function toggleCursor() {
        document.body.classList.toggle('large-cursor');
    }

    function toggleClickArea() {
        document.body.classList.toggle('large-click');
    }

    function toggleSlowMode() {
        const checkbox = document.getElementById('acc-slow');
        if (checkbox.checked) {
            JOGO.velocidadeForno = 20000; // Forno muito lento
            clearInterval(JOGO.timers.geracao);
            JOGO.timers.geracao = setInterval(gerarNovoPedido, 20000); // Pedidos lentos
            log("ACESSIBILIDADE: Modo Lento ativado.");
        } else {
            JOGO.velocidadeForno = 10000;
            clearInterval(JOGO.timers.geracao);
            JOGO.timers.geracao = setInterval(gerarNovoPedido, 12000);
            log("ACESSIBILIDADE: Velocidade normal restaurada.");
        }
        DOM.tempoForno.textContent = `${JOGO.velocidadeForno / 1000}s`;
    }

    function highlightLogs() {
        const checkbox = document.getElementById('acc-logs');
        if (checkbox.checked) {
            DOM.logs.style.border = "4px solid yellow";
            DOM.logs.style.fontSize = "16px";
            DOM.logs.style.color = "#000";
            DOM.logs.style.background = "#fff";
        } else {
            DOM.logs.style.border = "1px solid var(--border)";
            DOM.logs.style.fontSize = "12px";
            DOM.logs.style.color = "var(--text-muted)";
            DOM.logs.style.background = "var(--surface-alt)";
        }
    }

    // TTS Hover
    let synth = window.speechSynthesis;
    let isTTSActive = false;

    function toggleTTS(checkbox) {
        isTTSActive = checkbox.checked;
        if (isTTSActive) {
            document.body.addEventListener('mouseover', speakElement);
        } else {
            document.body.removeEventListener('mouseover', speakElement);
            synth.cancel();
        }
    }

    function speakElement(e) {
        if (!isTTSActive) return;
        
        // Evita falar containers grandes
        if (e.target.tagName === 'DIV' && !e.target.innerText) return;
        
        let text = e.target.innerText || e.target.getAttribute('aria-label') || e.target.alt;
        
        // Filtros para não falar código ou lixo
        if (text && text.length < 100 && text.trim().length > 0) {
            synth.cancel(); // Para a fala anterior
            let utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            synth.speak(utterance);
        }
    }

    // Guia de Leitura
    function toggleGuide() {
        const guide = document.getElementById('reading-guide');
        if (document.getElementById('acc-guide').checked) {
            guide.style.display = 'block';
            document.body.addEventListener('mousemove', moveGuide);
        } else {
            guide.style.display = 'none';
            document.body.removeEventListener('mousemove', moveGuide);
        }
    }
    function moveGuide(e) {
        const guide = document.getElementById('reading-guide');
        guide.style.top = e.clientY + 'px';
    }

    // Flash Alert
    function triggerVisualAlert() {
        const checkbox = document.getElementById('acc-flash');
        if (checkbox && checkbox.checked) {
            const original = document.body.style.backgroundColor;
            document.body.style.backgroundColor = "#ccc";
            setTimeout(() => {
                document.body.style.backgroundColor = original;
            }, 100);
            setTimeout(() => {
                document.body.style.backgroundColor = "#ccc";
            }, 200);
            setTimeout(() => {
                document.body.style.backgroundColor = "";
            }, 300);
        }
    }

    // --- FUNÇÕES PRINCIPAIS DO JOGO ---

    const log = (msg) => {
        DOM.logs.innerHTML = `<div style="margin-bottom:4px; border-bottom:1px dashed #eee; padding-bottom:2px;">[${new Date().toLocaleTimeString()}] ${msg}</div>` + DOM.logs.innerHTML;
        triggerVisualAlert(); // Aciona flash visual se habilitado
    };

    function atualizarStatusUI() {
        const elemento = DOM.hud.satisfacao;
        const valorAntigo = parseInt(elemento.textContent);

        // cores dinâmicas
        const s = JOGO.satisfacao;
        let cor = s > 70 ? '#22c55e' : s > 30 ? '#f59e0b' : '#ef4444';
        elemento.style.color = cor;

        elemento.textContent = `${s.toFixed(0)}%`;

        // animações dinâmicas
        if (s > valorAntigo) {
            elemento.classList.remove("satisfacao-down");
            elemento.classList.add("satisfacao-up");
        } else if (s < valorAntigo) {
            elemento.classList.remove("satisfacao-up");
            elemento.classList.add("satisfacao-down");
        }

        // remove classes depois da animação
        setTimeout(() => {
            elemento.classList.remove("satisfacao-up");
            elemento.classList.remove("satisfacao-down");
        }, 700);

        // valores normais restantes
        DOM.hud.orcamento.textContent = `$${JOGO.orcamento.toFixed(2)}`;
        DOM.hud.dia.textContent = `Dia: ${JOGO.dia}`;
        DOM.hud.rank.textContent = `Rank: ${JOGO.rank}`;
        DOM.stats.despesas.textContent = `$${JOGO.despesas.toFixed(2)}`;
        DOM.stats.score.textContent = `${JOGO.score} / ${JOGO.rank * 300}`;
        DOM.hud.preco.textContent = `Preço Pizza: $${JOGO.precoPizza}`;
        document.getElementById('display-preco').textContent = `$${JOGO.precoPizza}`;
    }

    

    function renderizarEstoque() {
        DOM.estoqueList.innerHTML = '';
        for (const itemKey in JOGO.estoque) {
            const item = JOGO.estoque[itemKey];
            const cor = item.quantidade <= 3 ? `color: var(--danger); font-weight:bold;` : '';
            const { html, classe } = getIconeIngrediente(item.nome);
            const div = document.createElement('div');
            div.className = 'estoque-item';
            div.innerHTML = `
                <div class="ingrediente-icone ${classe}" style="width: 24px; height: 24px;">${html}</div>
                <span style="${cor}">${item.nome}: <strong>${item.quantidade}</strong></span>
                <div style="margin-left:10px; text-align:right;">
                    <div style="font-size:12px; color:var(--text-muted);">Custo: $${item.custo.toFixed(2)}</div>
                    <button onclick="comprarEstoque('${itemKey}')" class="btn small" style="background:#fff; border:1px solid var(--border); color: var(--text-main); margin-top:6px; width:100%;">Comprar</button>
                </div>
            `;
            DOM.estoqueList.appendChild(div);
        }
    }

    function criarPedidoDOM(pedido) {
        const div = document.createElement('div');
        div.id = `pedido-${pedido.id}`;
        div.className = 'pedido-card';
        div.draggable = true;
        div.dataset.id = pedido.id;
        div.dataset.status = pedido.status;
        div.setAttribute('aria-label', `Pedido número ${pedido.id}. Receita inclui ${pedido.receita.coberturas.join(', ')}`);
        div.tabIndex = 0;

        const ingredientesReceita = [
            pedido.receita.crosta,
            pedido.receita.molho,
            pedido.receita.queijo,
            ...pedido.receita.coberturas
        ];
        
        const iconesReceita = ingredientesReceita.map(nome => {
            const { html, classe } = getIconeIngrediente(nome);
            return `<div class="ingrediente-icone ${classe}" style="width: 18px; height: 18px; margin: 0 2px; border-radius: 4px;">${html}</div>`;
        }).join('');

        const specialBadge = pedido.isEspecial ? `<div style="float:right; color:#b91c1c; font-weight:700;">SPECIAL</div>` : '';

        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong>Pedido #${pedido.id}</strong>
                <div style="display:flex; align-items:center; gap:10px;">
                    ${specialBadge}
                    <span class="tempo-espera" style="font-weight:bold; color: var(--text-muted);">0s</span>
                </div>
            </div>
            <div style="display: flex; align-items: center; margin-top: 8px;">${iconesReceita}</div>
            <div class="status-barra"><div class="progresso progresso-espera" style="width: 100%;"></div>
            <div class="humor-cliente" style="font-size:20px;" title="Humor será definido ao entregar">🙂</div></div>
        `;
        DOM.areas.fila.appendChild(div);
    }

    function comprarEstoque(itemKey) {
        const item = JOGO.estoque[itemKey];
        if (JOGO.orcamento >= item.custo) {
            JOGO.estoque[itemKey].quantidade += 5;
            JOGO.despesas += item.custo;
            JOGO.orcamento -= item.custo;
            renderizarEstoque();
            atualizarStatusUI();
            log(`Estoque: +5 ${item.nome}.`);
        } else {
            log(`Sem verba para ${item.nome}.`);
        }
    }

    function upgradeForno() {
        const custoUpgrade = 1000 * JOGO.rank;
        if (JOGO.orcamento >= custoUpgrade) {
            JOGO.orcamento -= custoUpgrade;
            JOGO.despesas += custoUpgrade;
            let reducao = 2000;
            JOGO.velocidadeForno = Math.max(2000, JOGO.velocidadeForno - reducao);
            DOM.tempoForno.textContent = `${JOGO.velocidadeForno / 1000}s`;
            DOM.btnUpgradeForno.textContent = `Upgrade Forno ($${1000 * (JOGO.rank + 1)})`;
            atualizarStatusUI();
            log(`Upgrade Forno realizado!`);
        } else {
            log(`Verba insuficiente para Upgrade.`);
        }
    }

    function abrirModalPreparo(pedido) {
        JOGO.pedidoEmPreparo = pedido;
        pedido.montagem = { crosta: null, molho: null, queijo: null, coberturas: [] };

        DOM.modal.titulo.textContent = `Preparando Pedido #${pedido.id}`;
        
        const ingredientesReceita = [
            pedido.receita.crosta,
            pedido.receita.molho,
            pedido.receita.queijo,
            ...pedido.receita.coberturas
        ];
        const receitaIcones = ingredientesReceita.map(nome => {
            const { html, classe } = getIconeIngrediente(nome);
            return `
                <div style="display: inline-flex; align-items: center; margin-right: 12px; margin-bottom: 5px;">
                    <div class="ingrediente-icone ${classe}" style="width: 20px; height: 20px; margin-right: 6px;">${html}</div>
                    <span style="color: var(--text-main); font-weight:500;">${nome}</span>
                </div>`;
        }).join('');
        DOM.modal.receita.innerHTML = receitaIcones;

        atualizarModalMontagem();
        renderizarIngredientesModal();
        DOM.modal.overlay.style.display = 'flex';
        DOM.modal.btnConfirmar.focus(); // Foco para navegação teclado
    }

    function atualizarModalMontagem() {
        const p = JOGO.pedidoEmPreparo;
        if (!p) return;

        const montagemIngredientes = [
            p.montagem.crosta,
            p.montagem.molho,
            p.montagem.queijo,
            ...p.montagem.coberturas
        ].filter(n => n);

        if (montagemIngredientes.length === 0) {
            DOM.modal.montagem.innerHTML = '<span style="color: var(--text-muted); font-style: italic;">Nenhum ingrediente selecionado.</span>';
            return;
        }

        const montagemIcones = montagemIngredientes.map(nome => {
            const { html, classe } = getIconeIngrediente(nome);
            return `
                <div style="display: inline-flex; align-items: center; margin-right: 10px; background: #fff; padding: 6px 12px; border-radius: 20px; border: 1px solid var(--border); margin-bottom: 5px;">
                    <div class="ingrediente-icone ${classe}" style="width: 18px; height: 18px; margin-right: 6px; border-radius: 4px;">${html}</div>
                    <span>${nome}</span>
                </div>`;
        }).join('');

        DOM.modal.montagem.innerHTML = montagemIcones;

        document.querySelectorAll('.ingrediente-item').forEach(btn => {
            const nome = btn.dataset.nome;
            let isSelected = false;
            if (p.montagem.crosta === nome) isSelected = true;
            else if (p.montagem.molho === nome) isSelected = true;
            else if (p.montagem.queijo === nome) isSelected = true;
            else if (p.montagem.coberturas.includes(nome)) isSelected = true;

            btn.classList.toggle('selecionado', isSelected);
            btn.setAttribute('aria-pressed', isSelected);
        });
    }

    function renderizarIngredientesModal() {
        DOM.modal.ingredientes.innerHTML = '';
        for (const itemKey in JOGO.estoque) {
            const item = JOGO.estoque[itemKey];
            const { html, classe } = getIconeIngrediente(item.nome);
            
            const div = document.createElement('button'); // Alterado div para button para ser focável
            div.className = 'ingrediente-item';
            div.dataset.nome = item.nome;
            div.dataset.key = itemKey;
            div.disabled = item.quantidade === 0;
            div.onclick = () => selecionarIngrediente(itemKey);
            div.setAttribute('aria-label', `Adicionar ${item.nome}, quantidade disponível ${item.quantidade}`);
            
            div.innerHTML = `
                <div class="ingrediente-icone ${classe}">${html}</div>
                <span style="margin-top:4px;">${item.nome}</span>
                <span style="font-size:10px; color:var(--text-muted);">qtd: ${item.quantidade}</span>
            `;
            
            if (item.quantidade === 0) {
                div.style.opacity = '0.5';
                div.style.cursor = 'not-allowed';
            }

            DOM.modal.ingredientes.appendChild(div);
        }
    }

    function selecionarIngrediente(itemKey) {
        const pedido = JOGO.pedidoEmPreparo;
        const ingredienteNome = JOGO.estoque[itemKey].nome;
        const db = JOGO.ingredientesDB;

        if (db.crostas.includes(ingredienteNome) && !pedido.montagem.crosta) pedido.montagem.crosta = ingredienteNome;
        else if (db.molhos.includes(ingredienteNome) && !pedido.montagem.molho) pedido.montagem.molho = ingredienteNome;
        else if (db.queijos.includes(ingredienteNome) && !pedido.montagem.queijo) pedido.montagem.queijo = ingredienteNome;
        else if (db.coberturas.includes(ingredienteNome)) {
            if (!pedido.montagem.coberturas.includes(ingredienteNome)) {
                pedido.montagem.coberturas.push(ingredienteNome);
            } else {
                pedido.montagem.coberturas = pedido.montagem.coberturas.filter(n => n !== ingredienteNome);
            }
        }
        atualizarModalMontagem();
    }

    function confirmarPreparo() {
        const pedido = JOGO.pedidoEmPreparo;
        if (!pedido.montagem.crosta || !pedido.montagem.molho || !pedido.montagem.queijo) {
            alert("Pizza incompleta! Adicione pelo menos crosta, molho e queijo.");
            return;
        }
        
        const ingredientesUsados = [
            pedido.montagem.crosta, 
            pedido.montagem.molho, 
            pedido.montagem.queijo, 
            ...pedido.montagem.coberturas
        ];

        for (const nomeUsado of ingredientesUsados) {
            const itemKey = Object.keys(JOGO.estoque).find(key => JOGO.estoque[key].nome === nomeUsado);
            if (itemKey && JOGO.estoque[itemKey].quantidade > 0) {
                JOGO.estoque[itemKey].quantidade--;
            } else if (itemKey) {
                    log(`ERRO: ${nomeUsado} acabou!`);
                    cancelarPreparo();
                    return;
            }
        }

        renderizarEstoque(); 
        moverPedido(pedido, DOM.areas.preparo, DOM.areas.forno, 'forno');
        DOM.modal.overlay.style.display = 'none';
        JOGO.pedidoEmPreparo = null;
    }

    function cancelarPreparo() {
        const pedido = JOGO.pedidoEmPreparo;
        const card = document.getElementById(`pedido-${pedido.id}`);
        if(card && card.parentElement.dataset.area === 'preparo') {
            DOM.areas.preparo.removeChild(card);
            DOM.areas.fila.appendChild(card);
        }
        
        if (pedido) {
            pedido.status = 'fila';
            if(card) card.dataset.status = 'fila';
        }
        
        DOM.modal.overlay.style.display = 'none';
        JOGO.pedidoEmPreparo = null;
    }

    function gerarNovoPedido() {
        if (JOGO.pedidosHoje >= JOGO.limitePedidosDia) return;

        // 🔥 INGREDIENTES LIBERADOS = os que estão no estoque
        const estoqueNomes = Object.values(JOGO.estoque).map(i => i.nome);

        // 🔥 Listas filtradas APENAS com ingredientes desbloqueados
        const crostasDisponiveis = JOGO.ingredientesDB.crostas.filter(i => estoqueNomes.includes(i));
        const molhosDisponiveis = JOGO.ingredientesDB.molhos.filter(i => estoqueNomes.includes(i));
        const queijosDisponiveis = JOGO.ingredientesDB.queijos.filter(i => estoqueNomes.includes(i));
        const coberturasDisponiveis = JOGO.ingredientesDB.coberturas.filter(i => estoqueNomes.includes(i));

        // 🔥 Garantia de que sempre exista pelo menos 1 opção de cada categoria
        if (!crostasDisponiveis.length || !molhosDisponiveis.length || !queijosDisponiveis.length) {
            console.error("ERRO: não existem ingredientes suficientes desbloqueados para gerar pedido.");
            return;
        }

        // 🔥 SORTEIO REAL baseado apenas nos ingredientes liberados
        const crosta = crostasDisponiveis[Math.floor(Math.random() * crostasDisponiveis.length)];
        const molho = molhosDisponiveis[Math.floor(Math.random() * molhosDisponiveis.length)];
        const queijo = queijosDisponiveis[Math.floor(Math.random() * queijosDisponiveis.length)];

        const qntCob = Math.floor(Math.random() * 2) + 1; // 1–2 coberturas
        const coberturas = coberturasDisponiveis
            .sort(() => Math.random() - 0.5)
            .slice(0, qntCob);

        const novoPedido = {
            id: JOGO.idContador++,
            status: 'fila',
            tempoMaximo: 90,
            tempoAtual: 0,
            timerEspera: null,
            receita: {
                crosta,
                molho,
                queijo,
                coberturas
            },
            montagem: {},
            isEspecial: false
        };

        if (JOGO.pedidosHoje + 1 === JOGO.limitePedidosDia) {
            novoPedido.isEspecial = true;
            novoPedido.tempoMaximo = 75;
        }

        JOGO.pedidos.push(novoPedido);
        JOGO.pedidosHoje++;
        criarPedidoDOM(novoPedido);
        iniciarTimerEspera(novoPedido);
        log(`Novo pedido #${novoPedido.id}${novoPedido.isEspecial ? ' (ESPECIAL)' : ''}.`);
    }

    function iniciarTimerEspera(pedido) {
        const card = document.getElementById(`pedido-${pedido.id}`);
        if (!card) return;
        
        const tempoSpan = card.querySelector('.tempo-espera');
        const barra = card.querySelector('.progresso-espera');

        pedido.timerEspera = setInterval(() => {
            if (pedido.status !== 'fila') {
                clearInterval(pedido.timerEspera);
                return;
            }
            
            pedido.tempoAtual++;
            tempoSpan.textContent = `${pedido.tempoAtual}s`;
            const progressoPercent = 100 - (pedido.tempoAtual / pedido.tempoMaximo) * 100;
            barra.style.width = `${progressoPercent}%`;

            if (pedido.tempoAtual > pedido.tempoMaximo) {
                clearInterval(pedido.timerEspera);
                JOGO.satisfacao = Math.max(0, JOGO.satisfacao - 15);
                card.remove();
                JOGO.pedidos = JOGO.pedidos.filter(p => p.id !== pedido.id);
                atualizarStatusUI();
                log(`Pedido #${pedido.id} perdido!`);
                // Se foi pedido especial, avança o dia
                if (pedido.isEspecial) advanceDay();
            } else if (pedido.tempoAtual > pedido.tempoMaximo * 0.6) {
                JOGO.satisfacao = Math.max(0, JOGO.satisfacao - 0.1);
                atualizarStatusUI();
            }
        }, 1000);
    }

    function cozinharPizza(pedido) {
        const card = document.getElementById(`pedido-${pedido.id}`);
        card.classList.add('cozinhando');
        
        card.querySelector('.status-barra').innerHTML = `<div class="progresso" style="width: 0%;"></div>`;
        const barra = card.querySelector('.progresso');
        
        let tempoDecorrido = 0;
        const timerCozimento = setInterval(() => {
            tempoDecorrido += 100;
            const progresso = (tempoDecorrido / JOGO.velocidadeForno) * 100;
            barra.style.width = `${progresso}%`;

            if (tempoDecorrido >= JOGO.velocidadeForno) {
                clearInterval(timerCozimento);
                card.classList.remove('cozinhando');
                card.classList.add('pronto-entrega');
                log(`Pedido #${pedido.id} assado.`);
            }
        }, 100);
    }

    function calcularNota(pedido) {
        // Opção 2: acertos + penalidade por tempo
        let acertos = 0;
        const receitaItens = [pedido.receita.crosta, pedido.receita.molho, pedido.receita.queijo, ...pedido.receita.coberturas];
        const totalItens = receitaItens.length;

        if (pedido.montagem.crosta === pedido.receita.crosta) acertos++;
        if (pedido.montagem.molho === pedido.receita.molho) acertos++;
        if (pedido.montagem.queijo === pedido.receita.queijo) acertos++;
        pedido.receita.coberturas.forEach(cob => { if (pedido.montagem.coberturas.includes(cob)) acertos++; });
        const coberturasExtras = pedido.montagem.coberturas.filter(cob => !pedido.receita.coberturas.includes(cob));
        acertos = Math.max(0, acertos - coberturasExtras.length);

        let nota = (acertos / totalItens) * 100;
        // penalidade por atraso: (tempoAtual / 1.5)
        nota -= (pedido.tempoAtual / 1.5);
        nota = Math.max(0, Math.min(100, nota));
        return { nota, acertos, totalItens };
    }

    function finalizarEntrega(pedido) {
        clearInterval(pedido.timerEspera);

        const { nota, acertos, totalItens } = calcularNota(pedido);

        // Valor final considerando qualidade
        const descontoPercent = (100 - nota) / 100;
        let valorFinal = JOGO.precoPizza * (1 - descontoPercent);

        // Regras especiais
        if (pedido.isEspecial) {
            if (nota < 95) {
                valorFinal *= 0.85;
                log(`Pedido especial #${pedido.id} abaixo de 95% → penalidade aplicada.`);
            } else if (nota === 100) {
                valorFinal *= 1.10;
                log(`Pedido especial perfeito! +10% bônus.`);
            }
        }

        // Aplicar ganho ao orçamento
        JOGO.orcamento += valorFinal - JOGO.custoBasePorPizza;
        JOGO.score += Math.round(
            50 * (acertos / totalItens) +
            Math.max(0, 30 - pedido.tempoAtual)
        );

        // -----------------------------------------
        // ⭐ SISTEMA PROFISSIONAL DE SATISFAÇÃO
        // -----------------------------------------

        let impacto = 0;

        // 1. Humor baseado na qualidade
        if (nota === 100) impacto += 4;           // perfeito
        else if (nota >= 85) impacto += 2;        // ótimo
        else if (nota >= 70) impacto += 1;        // bom
        else if (nota >= 50) impacto += 0;        // médio
        else if (nota >= 20) impacto -= 4;        // ruim
        else impacto -= 8;                        // muito ruim

        // 2. Tempo de atraso impacta fortemente
        if (pedido.tempoAtual > pedido.tempoMaximo * 0.7)
            impacto -= 3; // cliente ficou impaciente
        if (pedido.tempoAtual > pedido.tempoMaximo)
            impacto -= 15; // pedido atrasado (mas como chegou aqui, foi entregue)

        // 3. Erros de ingredientes
        const erros = totalItens - acertos;
        impacto -= erros * 1.5;

        // 4. Modificador geral da satisfação
        if (JOGO.satisfacao < 40) impacto *= 1.2;
        if (JOGO.satisfacao > 85) impacto *= 0.7;

        // 5. Ajuste da satisfação final
        JOGO.satisfacao = Math.max(0, Math.min(100, JOGO.satisfacao + impacto));

        // -----------------------------------------
        // FIM DO SISTEMA PROFISSIONAL
        // -----------------------------------------

        // Rank Up
        if (JOGO.score >= JOGO.rank * 300) {
            JOGO.rank++;
            JOGO.score = 0;
            log(`🏆 RANK UP! Agora você está no Rank ${JOGO.rank}!`);
            desbloquearIngredientesPorRank(JOGO.rank);
        }

        // Remover o card
        const card = document.getElementById(`pedido-${pedido.id}`);
        if(card) card.remove();
        JOGO.pedidos = JOGO.pedidos.filter(p => p.id !== pedido.id);

        log(`Entrega #${pedido.id}: nota ${nota.toFixed(1)}% → Satisfação ${impacto >= 0 ? '+' : ''}${impacto.toFixed(1)} → Valor $${valorFinal.toFixed(2)}.`);

        atualizarStatusUI();

        if (pedido.isEspecial) {
            setTimeout(() => advanceDay(), 600);
        }
    }


    function moverPedido(pedido, origemDOM, destinoDOM, novoStatus) {
        const card = document.getElementById(`pedido-${pedido.id}`);
        pedido.status = novoStatus;
        card.dataset.status = novoStatus;
        
        if (origemDOM !== destinoDOM) {
            origemDOM.removeChild(card);
            destinoDOM.appendChild(card);
        }

        if (novoStatus === 'preparo') {
            abrirModalPreparo(pedido);
        } else if (novoStatus === 'forno') {
            cozinharPizza(pedido);
        } else if (novoStatus === 'entrega') {
            finalizarEntrega(pedido);
        }
    }

    function setupDragAndDrop() {
        document.querySelectorAll('.area-trabalho').forEach(area => {
            area.addEventListener('dragover', e => { 
                e.preventDefault(); 
                area.classList.add('drag-over'); 
            });
            area.addEventListener('dragleave', () => area.classList.remove('drag-over'));
            area.addEventListener('drop', e => {
                e.preventDefault();
                area.classList.remove('drag-over');
                const pedidoId = parseInt(e.dataTransfer.getData("text/plain"));
                const pedido = JOGO.pedidos.find(p => p.id === pedidoId);
                if (!pedido) return;

                const card = document.getElementById(`pedido-${pedidoId}`);
                const origemDOM = card.parentElement;
                const novoStatus = area.dataset.area;
                
                if (novoStatus === 'preparo' && pedido.status === 'fila') {
                    moverPedido(pedido, origemDOM, area, novoStatus);
                } else if (novoStatus === 'entrega' && pedido.status === 'forno' && card.classList.contains('pronto-entrega')) {
                        moverPedido(pedido, origemDOM, area, novoStatus);
                }
            });
        });

        document.addEventListener('dragstart', e => {
            if (e.target.classList.contains('pedido-card') || e.target.closest('.pedido-card')) {
                const card = e.target.classList.contains('pedido-card') ? e.target : e.target.closest('.pedido-card');
                if (card.classList.contains('cozinhando')) {
                    e.preventDefault();
                    return;
                }
                e.dataTransfer.setData("text/plain", card.dataset.id);
            }
        });
    }

    function advanceDay() {
        log(`Dia ${JOGO.dia} encerrado. Avançando para o próximo dia...`);
        // limpar pedidos visuais e timers
        JOGO.pedidos.forEach(p => { if (p.timerEspera) clearInterval(p.timerEspera); });
        JOGO.pedidos = [];
        JOGO.pedidosHoje = 0;
        // limpar áreas
        ['fila-pedidos','area-preparo','forno','area-entrega'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = `<h3>${el.dataset ? el.dataset.area : ''}</h3>`; // simples limpeza
        });
        // atualizar dia
        JOGO.dia++;
        // reiniciar geração de pedidos
        clearInterval(JOGO.timers.geracao);
        JOGO.timers.geracao = setInterval(gerarNovoPedido, JOGO.tempoGeracaoPedido);
        // gerar primeiro pedido do novo dia
        setTimeout(() => gerarNovoPedido(), 800);
        atualizarStatusUI();
    }

    function iniciarJogo() {
        atualizarStatusUI();
        renderizarEstoque();
        setupDragAndDrop();

        DOM.btnUpgradeForno.addEventListener('click', upgradeForno);
        DOM.modal.btnConfirmar.addEventListener('click', confirmarPreparo);
        DOM.modal.btnCancelar.addEventListener('click', cancelarPreparo);

        JOGO.timers.geracao = setInterval(gerarNovoPedido, JOGO.tempoGeracaoPedido); 
        gerarNovoPedido(); 

        log("Pizzaria aberta.");
    }

    iniciarJogo();

    (function() {
      const btn = document.getElementById('access-btn');
      const panel = document.getElementById('access-panel');
      const closeBtn = document.getElementById('close-access');
      const resetBtn = document.getElementById('reset-access');
      const fontSlider = document.getElementById('font-slider');
      const fontSizeDisplay = document.getElementById('font-size-val');
  
      if (btn && panel) {
          btn.addEventListener('click', () => panel.classList.toggle('hidden'));
          if(closeBtn) closeBtn.addEventListener('click', () => panel.classList.add('hidden'));
      }
  
      if (fontSlider) {
          fontSlider.addEventListener('input', (e) => {
              const val = e.target.value;
              if(fontSizeDisplay) fontSizeDisplay.textContent = val + '%';
              document.documentElement.style.setProperty('--font-scale', val + '%');
          });
      }
  
      window.toggleAccess = function(mode) {
          const body = document.body;
          const className = 'acc-' + mode;
          body.classList.toggle(className);
          
          if (mode === 'high-contrast' && body.classList.contains(className)) {
               body.classList.remove('acc-invert');
          }
          updateButtons();
      };
  
      function updateButtons() {
          const buttons = document.querySelectorAll('.access-grid button');
          buttons.forEach(b => {
              const onclickVal = b.getAttribute('onclick');
              if(onclickVal) {
                  const mode = onclickVal.match(/'([^']+)'/)[1];
                  if (document.body.classList.contains('acc-' + mode)) {
                      b.classList.add('active');
                  } else {
                      b.classList.remove('active');
                  }
              }
          });
      }
  
      if (resetBtn) {
          resetBtn.addEventListener('click', () => {
              const body = document.body;
              const classes = Array.from(body.classList).filter(c => c.startsWith('acc-'));
              classes.forEach(c => body.classList.remove(c));
              
              if(fontSlider) {
                  fontSlider.value = 100;
                  if(fontSizeDisplay) fontSizeDisplay.textContent = '100%';
                  document.documentElement.style.setProperty('--font-scale', '100%');
              }
              updateButtons();
          });
      }
  })();