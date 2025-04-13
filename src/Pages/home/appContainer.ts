import CardComment from '../../components/cardComment';
import CardViewer from '../../components/cardViewer';

class AppContainer extends HTMLElement {
    private shadow: ShadowRoot;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        new CardComment();
        new CardViewer();
    }

    connectedCallback(): void {
        this.render();
    }

    render(): void {
        if (!this.shadow) return;

        this.shadow.innerHTML = `

        
        <link rel="stylesheet" href="/styles/appContainer.css">
        <div class="Container">
            <card-comment
                UserProfile="/icons/user en circulo-09.png" 
                UserName="jlouisce"
            ></card-comment>

            <card-viewer
                UserProfile="/icons/user en circulo-09.png" 
                UserName="Xdavid016"
                Comment="This song..."
                SongName="GODDES"
                Album="Primera Musa"
                Artist="Omar Courtz"
                AlbumCover="/imgs/albumPrimeraMusa.jpeg"
            ></card-viewer>
        </div>
        `;
    }
}

if (!customElements.get('app-container')) {
    customElements.define('app-container', AppContainer);
}
