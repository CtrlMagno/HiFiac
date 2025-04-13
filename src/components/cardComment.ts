class CardComment extends HTMLElement {
    private shadow: ShadowRoot;

    static get observedAttributes(): string[] {
        return ['UserProfile', 'UserName'];
    }

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        this.render();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        if (oldValue !== newValue) {
            this.setAttribute(name, newValue);
            this.render();
        }
    }

    render(): void {
        if (!this.shadow) return;

        this.shadow.innerHTML = `
            <link rel="stylesheet" href="/styles/cardComment.css">
            <div class="GlobalContainer">
                <div class="CardCommentSection">
                    <div class="CardHeader">
                        <img src="${this.getAttribute("UserProfile")}" alt="" class="UserProfile">
                        <p class="UserName">${this.getAttribute("UserName")}</p>
                    </div>

                    <div class="CardComment">
                        <textarea class="TextCamp" placeholder="What is the song of the day?"></textarea>
                    </div>

                    <div class="CardFooter">
                        <a href=""><p class="Button">Submit</p></a>
                        <a href=""><img src="/icons/musica-06.png" alt="" class="IconMusic"></a>
                    </div>
                </div>
            </div>
        `;
    }
}

if (!customElements.get('card-comment')) {
    customElements.define('card-comment', CardComment);
}

export default CardComment;
