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

        </style>

        <div class="Container">

        <card-comment

        UserProfile="../../../public/icons/user en circulo-09.png" 
        UserName="jlouisce"

        ></card-comment>

        </div>

        `;
    }
}

customElements.define('app-container', AppContainer);