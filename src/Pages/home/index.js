import * as components from '../../components/index.js'; 



class AppContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }
    connectedCallback() {
        this.render();
    }

    

    render() {
        this.shadowRoot.innerHTML = `
        <style>

        img{
        width: 2vh;
        height: auto;
        }

        </style>

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

        <card-viewer
        UserProfile="../../../public/icons/user en circulo-09.png" 
        UserName="Pepe69"
        Comment="BROOOOOO"
        SongName="FANTASMA | AVC"
        Album="DATA"
        Artist="Tainy"
        AlbumCover="../../../public/imgs/albumDATA.jpeg"

        ></card-viewer>

        <card-viewer
        UserProfile="../../../public/icons/user en circulo-09.png" 
        UserName="Xdavid016"
        Comment="This song..."
        SongName="GODDES"
        Album="Primera Musa"
        Artist="Omar Courtz"
        AlbumCover="../../../public/imgs/albumPrimeraMusa.jpeg"

        ></card-viewer>

        <card-viewer
        UserProfile="../../../public/icons/user en circulo-09.png" 
        UserName="Pepe69"
        Comment="BROOOOOO"
        SongName="FANTASMA | AVC"
        Album="DATA"
        Artist="Tainy"
        AlbumCover="../../../public/imgs/albumDATA.jpeg"

        ></card-viewer>

        <card-viewer
        UserProfile="../../../public/icons/user en circulo-09.png" 
        UserName="Xdavid016"
        Comment="This song..."
        SongName="GODDES"
        Album="Primera Musa"
        Artist="Omar Courtz"
        AlbumCover="../../../public/imgs/albumPrimeraMusa.jpeg"

        ></card-viewer>

        <card-viewer
        UserProfile="../../../public/icons/user en circulo-09.png" 
        UserName="Pepe69"
        Comment="BROOOOOO"
        SongName="FANTASMA | AVC"
        Album="DATA"
        Artist="Tainy"
        AlbumCover="../../../public/imgs/albumDATA.jpeg"

        ></card-viewer>

        </div>

        `;
    }
}

customElements.define('app-container', AppContainer);