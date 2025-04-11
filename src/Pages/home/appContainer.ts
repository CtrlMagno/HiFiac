class AppContainer extends HTMLElement {
    shadowRoot: ShadowRoot;

    constructor() {
        super();
        this.shadowRoot = this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        this.render();
    }

    render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="../../../public/styles/appContainer.css">
        <div class="Container">
            <card-comment
                UserProfile="../../../public/icons/user en circulo-09.png" 
                UserName="jlouisce"
            ></card-comment>

            <card-viewer
                UserProfile="../../../public/icons/user en circulo-09.png" 
                UserName="Xdavid016"
                Comment="This song..."
                SongName="GODDES"
                Album="Primera Musa"
                Artist="Omar Courtz"
                AlbumCover="../../../public/imgs/albumPrimeraMusa.jpeg"
            ></card-viewer>

            <!-- Repeticiones omitidas para abreviar -->
        </div>
        `;
    }
}

customElements.define('app-container', AppContainer);
