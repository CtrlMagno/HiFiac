class CardViewer extends HTMLElement {

    static get observedAttributes (): string[] {
        return ['UserProfile', 'UserName', 'Comment', 'SongName', 'Album', 'AlbumCover', 'Artist'];
    }

    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback(): void {
        this.render();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if(oldValue !== newValue){
            this.setAttribute(name, newValue);
            this.render();
        }
    }


    render(): void {
        if (this.shadowRoot) { 
        
            this.shadowRoot.innerHTML=`
            <link rel="stylesheet" href="../../../public/styles/cardViewer.css">

            <div class="MegaCardContainer">
                <div class="GlobalCardContainer">
                    <div class="CardViewer">
                        <div class="CardHeader">
                            <img src="${this.getAttribute('UserProfile')}" alt="" class="UserProfile">
                            <p class="UserName">${this.getAttribute('UserName')}</p>
                        </div>

                        <p class="Comment">${this.getAttribute('Comment')}</p>

                        <div class="Music">
                            <div class="Music1">
                                <div class="Music2">
                                    <p class="SongName">${this.getAttribute('SongName')}</p>
                                    <p class="Album">${this.getAttribute('Album')}</p>
                                </div>

                                <p class="Artist">${this.getAttribute('Artist')}</p>
                            </div>

                            <img src="${this.getAttribute('AlbumCover')}" alt="" class="AlbumCover">
                        </div>
                        <div class="Commentary">
                            <textarea class="TextCamp1" placeholder="Comment something :/"></textarea>
                            <a href=""><img src="../../../public/icons/publicar-08.png" alt="" class="IconMessage"></a>
                        </div>

                    </div>
                </div>
            </div>
            `;
        }
    }
}

customElements.define('card-viewer', CardViewer)

export default CardViewer;
