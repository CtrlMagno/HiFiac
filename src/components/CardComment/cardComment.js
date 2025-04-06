class CardComment extends HTMLElement {

    static get observedAttributes (){
        return ['userProfile', 'userName'];
    }

    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback(){
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue){
        if(oldValue !== newValue){
            this[name]=newValue; 
            this.render();
        }
    }


    render(){
        this.shadowRoot.innerHTML=`
        <style>
        
            .Icon{
                width: 7vh;
                height: auto;
            }

            .NavBarIcons{
                gap: 5vh;
                margin-top: 4vh;
                margin-right: 19vh;
            }

            img{
                width: 3vh;
                height: auto;
            }

            .CardCommentSection{
                border: 1px solid #FFC7C8;
                width: 80%;
                border-radius: 20px;
                height: auto;
                justify-content: center;
                align-items: center;
                padding-right: 5vh;
                padding-left: 5vh;
                padding-top: 2vh;
                padding-bottom: 2vh;
            }

            .GlobalContainer{
                display: flex;
                justify-content: center;
                margin-top: 4vh;
                margin-bottom: 4vh;
            }

            .UserProfile{
                width: 10vh;
                height: auto;
            }

            .CardHeader{
                display: flex;
                align-items: center;
                gap: 5vh;
            }

            .UserName{
                font-size: 100%;
                font-weight: 600;
            }

            .TextCamp{
                width: 98%;
                height: 150px;
                padding: 10px;
                resize: none;
                border: 1px solid #F2EDE3;
                border-radius: 20px;
                margin-top: 2vh;
                margin-bottom: 2vh;
                font-size: 14px;
                background-color: #F2EDE3;
                outline: none;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            }

            .CardFooter{
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .IconMusic{
                width: 9vh;
                height: auto;
            }

            .Button{
                display: flex;
                text-align: center;
                color: #020202;
                background-color: #F2EDE3;
                width: fit-content;
                height: auto;
                border-radius: 6px;
                padding-right: 10vh;
                padding-left: 10vh;
                padding-top: 2vh;
                padding-bottom: 2vh;
                margin-bottom: 5vh;
            }

            a{
                text-decoration: none;
            }

        </style>


        <div class="GlobalContainer">

        <div class="CardCommentSection">
            <div class="CardHeader">

                <img src="${this.userProfile}" alt="" class="UserProfile">

                <p class="UserName">${this.userName}</p>

            </div>

            <div class="CardComment">

                <textarea class="TextCamp" placeholder="What is the song of the day?"></textarea>

            </div>

            <div class="CardFooter">

                <a href=""><p class="Button">Sumbit</p></a>

                <a href=""><img src="../../../public/icons/musica-06.png" alt="" class="IconMusic"></a>

            </div>
        </div>

        `;
    }
}

customElements.define('card-comment', CardComment)

export default CardComment;
