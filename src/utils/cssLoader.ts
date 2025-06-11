/**
 * Utilidad para cargar CSS en componentes Shadow DOM
 */

// CSS content para cada componente
const componentStyles: { [key: string]: string } = {

  




  'postCreator': `
    .GlobalContainer {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
    }

    .PostCreatorCard {
      background: #020202;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(255, 199, 200, 0.2);
      width: 100%;
      max-width: 600px;
      padding: 20px;
      border: 1px solid #FFC7C8;
    }

    .CardHeader {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
    }

    .UserProfile {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 12px;
      border: 2px solid #FFC7C8;
    }

    .UserInfo {
      flex: 1;
    }

    .UserName {
      font-weight: 600;
      font-size: 14px;
      color: #FFC7C8;
      margin: 0;
      line-height: 1.2;
    }

    .PostType {
      font-size: 12px;
      color: #cccccc;
      margin: 2px 0 0 0;
      line-height: 1.2;
    }

    .PostContent {
      margin-bottom: 15px;
    }

    .TextArea {
      width: 100%;
      min-height: 80px;
      max-height: 200px;
      border: none;
      outline: none;
      resize: vertical;
      font-family: inherit;
      font-size: 16px;
      line-height: 1.4;
      color: #FFC7C8;
      background: transparent;
      padding: 0;
      margin-bottom: 8px;
    }

    .TextArea::placeholder {
      color: #999999;
    }

    .CharacterCount {
      text-align: right;
      font-size: 12px;
      color: #cccccc;
      margin-bottom: 10px;
    }

    .ImagePreview {
      margin: 15px 0;
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #FFC7C8;
    }

    .ImagePreview img {
      width: 100%;
      max-height: 300px;
      object-fit: cover;
      display: block;
    }

    .RemoveImageBtn {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease;
    }

    .RemoveImageBtn:hover {
      background: rgba(0, 0, 0, 0.9);
    }

    .MusicPreview {
      margin: 15px 0;
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #FFC7C8;
      background: rgba(255, 199, 200, 0.1);
      padding: 12px;
    }

    .MusicInfo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .MusicCover {
      width: 60px;
      height: 60px;
      border-radius: 6px;
      object-fit: cover;
      flex-shrink: 0;
    }

    .MusicDetails {
      flex: 1;
      min-width: 0;
    }

    .MusicTitle {
      font-weight: 600;
      font-size: 14px;
      color: #FFC7C8;
      margin-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .MusicArtist {
      font-size: 13px;
      color: #cccccc;
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .MusicAlbum {
      font-size: 12px;
      color: #999999;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .RemoveMusicBtn {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease;
    }

    .RemoveMusicBtn:hover {
      background: rgba(0, 0, 0, 0.9);
    }

    .MusicIcon {
      font-size: 18px;
      line-height: 1;
    }

    .ErrorMessage {
      background: rgba(214, 48, 49, 0.2);
      color: #ff6b6b;
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #ff6b6b;
      font-size: 14px;
      margin: 10px 0;
    }

    .SuccessMessage {
      background: rgba(0, 184, 148, 0.2);
      color: #00d4aa;
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #00d4aa;
      font-size: 14px;
      margin: 10px 0;
    }

    .CardFooter {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid #FFC7C8;
    }

    .LeftActions {
      display: flex;
      gap: 8px;
    }

    .RightActions {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .ActionButton {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid #FFC7C8;
      background: rgba(255, 199, 200, 0.1);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .ActionButton:hover {
      background: rgba(255, 199, 200, 0.2);
      transform: scale(1.05);
    }

    .ActionIcon {
      width: 20px;
      height: 20px;
      object-fit: contain;
    }

    .ImageIcon {
      font-size: 18px;
      line-height: 1;
    }

    .CancelButton {
      background: transparent;
      border: 1px solid #FFC7C8;
      color: #FFC7C8;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .CancelButton:hover {
      background: rgba(255, 199, 200, 0.1);
      border-color: #FFC7C8;
      transform: scale(1.02);
    }

    .PublishButton {
      background: #FFC7C8;
      color: #020202;
      border: none;
      padding: 8px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s ease;
      min-width: 80px;
    }

    .PublishButton:hover {
      background: #ffb3b6;
      transform: scale(1.02);
    }

    .PublishButton:disabled {
      background: #666666;
      color: #999999;
      cursor: not-allowed;
      transform: none;
    }

    @media (max-width: 768px) {
      .PostCreatorCard {
        margin: 0 10px;
        padding: 15px;
      }
      
      .CardFooter {
        flex-direction: column;
        gap: 10px;
        align-items: stretch;
      }
      
      .RightActions {
        justify-content: space-between;
        width: 100%;
      }
    }
  `,

  'postFeed': `
    /* Estilos para el componente PostFeed */
    .FeedContainer {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 0 10px;
    }

    /* Estados de carga y vacío */
    .LoadingState {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px 20px;
        color: #cccccc;
    }

    .LoadingSpinner {
        width: 40px;
        height: 40px;
        border: 3px solid #333333;
        border-top: 3px solid #FFC7C8;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 16px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .EmptyState {
        text-align: center;
        padding: 60px 20px;
        color: #cccccc;
    }

    .EmptyIcon {
        font-size: 48px;
        margin-bottom: 16px;
        color: #FFC7C8;
    }

    .EmptyState h3 {
        font-size: 18px;
        font-weight: 600;
        margin: 0 0 8px 0;
        color: #FFC7C8;
    }

    .EmptyState p {
        font-size: 14px;
        margin: 0;
        line-height: 1.4;
    }

    /* Tarjetas de posts */
    .PostCard {
        background: #020202;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(255, 199, 200, 0.2);
        margin-bottom: 20px;
        border: 1px solid #FFC7C8;
        overflow: hidden;
    }

    /* Header del post */
    .PostHeader {
        display: flex;
        align-items: center;
        padding: 16px 20px 12px;
    }

    .UserAvatar {
        width: 36px !important;
        height: 36px !important;
        border-radius: 50% !important;
        object-fit: cover !important;
        margin-right: 12px !important;
        border: 2px solid #FFC7C8 !important;
        flex-shrink: 0 !important;
    }

    .UserInfo {
        flex: 1;
    }

    .Username {
        font-weight: 600;
        font-size: 14px;
        color: #FFC7C8;
        margin: 0 0 2px 0;
        line-height: 1.2;
    }

    .PostTime {
        font-size: 12px;
        color: #cccccc;
        margin: 0;
        line-height: 1.2;
    }

    /* Contenido del post */
    .PostContent {
        padding: 0 20px 16px;
    }

    .PostText {
        font-size: 16px;
        line-height: 1.4;
        color: #FFC7C8;
        margin: 0 0 12px 0;
        word-wrap: break-word;
    }

    .PostImage {
        margin-top: 12px;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #FFC7C8;
    }

    .PostImg {
        width: 100%;
        height: auto;
        max-height: 400px;
        object-fit: cover;
        display: block;
    }

    /* Footer del post */
    .PostFooter {
        padding: 8px 20px 16px;
        border-top: 1px solid #FFC7C8;
    }

    .PostActions {
        display: flex;
        gap: 20px;
    }

    .ActionBtn {
        display: flex;
        align-items: center;
        gap: 6px;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 8px 12px;
        border-radius: 6px;
        transition: all 0.2s ease;
        font-size: 14px;
        color: #cccccc;
    }

    .ActionBtn:hover {
        background: rgba(255, 199, 200, 0.1);
        color: #FFC7C8;
        transform: scale(1.05);
    }

    .ActionIcon {
        font-size: 16px;
        line-height: 1;
    }

    .ActionCount {
        font-weight: 500;
        min-width: 16px;
        text-align: left;
    }

    .LikeBtn.liked {
        color: #e41e3f;
    }

    .LikeBtn.liked:hover {
        background: rgba(255, 199, 200, 0.2);
    }

    /* Sección de comentarios */
    .CommentsSection {
        padding: 12px 20px 16px;
        border-top: 1px solid #FFC7C8;
        background: rgba(255, 199, 200, 0.05);
    }

    .Comment {
        display: flex;
        align-items: flex-start;
        margin-bottom: 12px;
        gap: 8px;
    }

    .Comment:last-child {
        margin-bottom: 0;
    }

    .CommentAvatar {
        width: 32px !important;
        height: 32px !important;
        border-radius: 50% !important;
        object-fit: cover !important;
        border: 1px solid #FFC7C8 !important;
        flex-shrink: 0 !important;
    }

    .CommentContent {
        flex: 1;
        background: rgba(255, 199, 200, 0.1);
        padding: 8px 12px;
        border-radius: 16px;
        border: 1px solid #FFC7C8;
    }

    .CommentUsername {
        font-weight: 600;
        font-size: 12px;
        color: #FFC7C8;
        margin-right: 6px;
    }

    .CommentText {
        font-size: 13px;
        color: #cccccc;
        line-height: 1.3;
        word-wrap: break-word;
    }

    .ShowMoreComments {
        background: transparent;
        border: none;
        color: #cccccc;
        font-size: 13px;
        cursor: pointer;
        padding: 4px 0;
        margin-top: 8px;
        transition: color 0.2s ease;
    }

    .ShowMoreComments:hover {
        color: #FFC7C8;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .FeedContainer {
            padding: 0 5px;
        }
        
        .PostCard {
            border-radius: 8px;
            margin-bottom: 15px;
        }
        
        .PostHeader {
            padding: 12px 15px 8px;
        }
        
        .PostContent {
            padding: 0 15px 12px;
        }
        
        .PostFooter {
            padding: 6px 15px 12px;
        }
        
        .CommentsSection {
            padding: 10px 15px 12px;
        }
        
        .UserAvatar {
            width: 34px !important;
            height: 34px !important;
            margin-right: 10px !important;
        }
        
        .PostText {
            font-size: 15px;
        }
        
        .PostActions {
            gap: 15px;
        }
        
        .ActionBtn {
            padding: 6px 10px;
            font-size: 13px;
        }
    }

    @media (max-width: 480px) {
        .FeedContainer {
            padding: 0;
        }
        
        .PostCard {
            border-radius: 0;
            border-left: none;
            border-right: none;
            margin-bottom: 10px;
        }
        
        .PostHeader {
            padding: 10px 12px 6px;
        }
        
        .PostContent {
            padding: 0 12px 10px;
        }
        
        .PostFooter {
            padding: 5px 12px 10px;
        }
        
        .CommentsSection {
            padding: 8px 12px 10px;
        }
        
        .UserAvatar {
            width: 32px !important;
            height: 32px !important;
            margin-right: 8px !important;
        }
        
        .PostText {
            font-size: 14px;
        }
        
        .PostActions {
            gap: 12px;
        }
        
        .ActionBtn {
            padding: 5px 8px;
            font-size: 12px;
        }
        
        .EmptyState {
            padding: 40px 20px;
        }
        
        .EmptyIcon {
            font-size: 40px;
        }
        
        .EmptyState h3 {
            font-size: 16px;
        }
        
        .EmptyState p {
            font-size: 13px;
        }
    }

    /* Animaciones */
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .PostCard {
        animation: fadeIn 0.4s ease-out;
    }

    /* Estados de hover mejorados */
    .PostCard:hover {
        box-shadow: 0 4px 12px rgba(255, 199, 200, 0.3);
        transition: box-shadow 0.2s ease;
        transform: translateY(-2px);
    }

    /* Efectos en botones */
    .ActionBtn:active {
        transform: scale(0.95);
    }

    .LikeBtn.liked .ActionIcon {
        animation: heartBeat 0.6s ease-in-out;
    }

    @keyframes heartBeat {
        0% { transform: scale(1); }
        14% { transform: scale(1.3); }
        28% { transform: scale(1); }
        42% { transform: scale(1.2); }
        70% { transform: scale(1); }
    }
  `,

  'commentModal': `
    /* Estilos para el CommentModal */
    .ModalOverlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        animation: fadeIn 0.2s ease-out;
    }

    .ModalContainer {
        background: #020202;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(255, 199, 200, 0.3);
        width: 100%;
        max-width: 600px;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        animation: slideIn 0.3s ease-out;
        overflow: hidden;
        border: 1px solid #FFC7C8;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideIn {
        from { 
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
        }
        to { 
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .ModalHeader {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        border-bottom: 1px solid #FFC7C8;
        background: rgba(255, 199, 200, 0.1);
    }

    .ModalHeader h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #FFC7C8;
    }

    .CloseButton {
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: #cccccc;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .CloseButton:hover {
        background: rgba(255, 199, 200, 0.2);
        color: #FFC7C8;
        transform: scale(1.1);
    }

    .PostPreview {
        padding: 16px 24px;
        border-bottom: 1px solid #FFC7C8;
        background: rgba(255, 199, 200, 0.05);
    }

    .PostAuthor {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
    }

    .AuthorAvatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        margin-right: 8px;
        border: 2px solid #FFC7C8;
    }

    .AuthorName {
        font-weight: 600;
        font-size: 14px;
        color: #FFC7C8;
    }

    .PostText {
        margin: 0;
        font-size: 15px;
        line-height: 1.4;
        color: #cccccc;
    }

    .CommentsSection {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
    }

    .CommentsHeader {
        padding: 16px 24px 8px;
        border-bottom: 1px solid #FFC7C8;
    }

    .CommentsCount {
        font-size: 14px;
        font-weight: 600;
        color: #FFC7C8;
    }

    .CommentsList {
        flex: 1;
        overflow-y: auto;
        padding: 0 24px;
        max-height: 300px;
    }

    .NoComments {
        text-align: center;
        padding: 40px 20px;
        color: #65676b;
        font-style: italic;
    }

    .CommentItem {
        display: flex;
        padding: 12px 0;
        border-bottom: 1px solid #f0f2f5;
        gap: 12px;
    }

    .CommentItem:last-child {
        border-bottom: none;
    }

    .CommentAvatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #e1e5e9;
        flex-shrink: 0;
    }

    .CommentContent {
        flex: 1;
        min-width: 0;
    }

    .CommentHeader {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
    }

    .CommentAuthor {
        font-weight: 600;
        font-size: 13px;
        color: #1c1e21;
    }

    .CommentTime {
        font-size: 12px;
        color: #65676b;
    }

    .CommentText {
        margin: 0;
        font-size: 14px;
        line-height: 1.4;
        color: #1c1e21;
        word-wrap: break-word;
    }

        .CommentForm {
      border-top: 1px solid #e1e5e9;
      padding: 16px 24px;
      background: white;
    }

    .CurrentUserInfo {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e1e5e9;
    }

    .CurrentUserAvatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #e1e5e9;
      flex-shrink: 0;
    }

    .CurrentUserDetails {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .CurrentUserName {
      font-weight: 600;
      font-size: 14px;
      color: #1c1e21;
      line-height: 1.2;
    }

    .CommentPrompt {
      font-size: 12px;
      color: #65676b;
      line-height: 1.2;
    }

    .CommentInputContainer {
      margin-bottom: 12px;
    }

        .CommentInput {
      width: 100%;
      border: 1px solid #e1e5e9;
      border-radius: 12px;
      padding: 12px 16px;
      font-family: inherit;
      font-size: 14px;
      line-height: 1.4;
      resize: none;
      outline: none;
      transition: border-color 0.2s ease;
      min-height: 80px;
      max-height: 120px;
      background: white;
      box-sizing: border-box;
    }

    .CommentInput:focus {
        border-color: #1877f2;
    }

    .CommentInput::placeholder {
        color: #65676b;
    }

    .CommentFormFooter {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .CharacterCount {
        font-size: 12px;
        color: #65676b;
        transition: color 0.2s ease;
    }

    .CharacterCount.limit-warning {
        color: #e17055;
    }

    .CharacterCount.limit-danger {
        color: #d63031;
        font-weight: 600;
    }

    .SubmitButton {
        background: #1877f2;
        color: white;
        border: none;
        border-radius: 20px;
        padding: 8px 20px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s ease;
        min-width: 80px;
    }

    .SubmitButton:hover:not(:disabled) {
        background: #166fe5;
    }

    .SubmitButton:disabled {
        background: #bcc0c4;
        cursor: not-allowed;
    }

    .MessageContainer {
        margin-bottom: 12px;
        padding: 10px 12px;
        border-radius: 8px;
        font-size: 14px;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        pointer-events: none;
    }

    .MessageContainer.visible {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
    }

    .MessageContainer.error {
        background: #ffe6e6;
        color: #d63031;
        border: 1px solid #fab1a0;
    }

    .MessageContainer.success {
        background: #e8f5e8;
        color: #00b894;
        border: 1px solid #a8e6cf;
    }

    .LoginPrompt {
        text-align: center;
        padding: 24px;
        border-top: 1px solid #e1e5e9;
        background: #f8f9fa;
    }

    .LoginPrompt p {
        margin: 0 0 16px 0;
        color: #65676b;
        font-size: 14px;
    }

    .LoginButton {
        background: #1877f2;
        color: white;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 14px;
        transition: background 0.2s ease;
    }

    .LoginButton:hover {
        background: #166fe5;
    }

        @media (max-width: 768px) {
      .ModalOverlay { padding: 10px; }
      .ModalContainer { max-height: 90vh; border-radius: 12px; }
      .ModalHeader { padding: 16px 20px; }
      .PostPreview { padding: 12px 20px; }
      .CommentsList { padding: 0 20px; }
      .CommentForm { padding: 12px 20px; }
      .CurrentUserInfo { padding: 10px; margin-bottom: 12px; }
      .CurrentUserAvatar { width: 36px; height: 36px; }
      .CurrentUserName { font-size: 13px; }
      .CommentPrompt { font-size: 11px; }
      .CommentInput { min-height: 70px; padding: 10px 14px; }
      .CommentAvatar { width: 32px; height: 32px; }
      .AuthorAvatar { width: 28px; height: 28px; }
    }

        @media (max-width: 480px) {
      .ModalOverlay { padding: 0; align-items: flex-end; }
      .ModalContainer { max-height: 95vh; border-radius: 12px 12px 0 0; margin-bottom: 0; }
      .ModalHeader { padding: 12px 16px; }
      .ModalHeader h3 { font-size: 16px; }
      .PostPreview { padding: 10px 16px; }
      .CommentsList { padding: 0 16px; max-height: 250px; }
      .CommentForm { padding: 10px 16px; }
      .CurrentUserInfo { padding: 8px; margin-bottom: 10px; }
      .CurrentUserAvatar { width: 32px; height: 32px; }
      .CurrentUserName { font-size: 12px; }
      .CommentPrompt { font-size: 10px; }
      .CommentInput { border-radius: 10px; padding: 8px 12px; font-size: 13px; min-height: 60px; }
      .SubmitButton { border-radius: 16px; padding: 6px 16px; font-size: 13px; }
      .CommentText { font-size: 13px; }
      .CharacterCount { font-size: 11px; }
    }

    .CommentsList::-webkit-scrollbar { width: 6px; }
    .CommentsList::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
    .CommentsList::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
         .CommentsList::-webkit-scrollbar-thumb:hover { background: #a1a1a1; }
   `,

   'musicSearchModal': `
     /* Estilos para MusicSearchModal */
     .ModalOverlay {
         position: fixed;
         top: 0;
         left: 0;
         right: 0;
         bottom: 0;
         background: rgba(0, 0, 0, 0.5);
         backdrop-filter: blur(4px);
         z-index: 1002;
         display: flex;
         align-items: center;
         justify-content: center;
         padding: 20px;
         animation: fadeIn 0.2s ease-out;
     }

     .ModalContainer {
         background: white;
         border-radius: 16px;
         box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
         width: 100%;
         max-width: 700px;
         max-height: 80vh;
         display: flex;
         flex-direction: column;
         animation: slideIn 0.3s ease-out;
         overflow: hidden;
     }

     @keyframes fadeIn {
         from { opacity: 0; }
         to { opacity: 1; }
     }

     @keyframes slideIn {
         from { 
             opacity: 0;
             transform: translateY(-20px) scale(0.95);
         }
         to { 
             opacity: 1;
             transform: translateY(0) scale(1);
         }
     }

     .ModalHeader {
         display: flex;
         justify-content: space-between;
         align-items: center;
         padding: 20px 24px;
         border-bottom: 1px solid #e1e5e9;
         background: #f8f9fa;
     }

     .ModalHeader h3 {
         margin: 0;
         font-size: 18px;
         font-weight: 600;
         color: #1c1e21;
     }

     .CloseButton {
         width: 32px;
         height: 32px;
         border: none;
         background: transparent;
         border-radius: 50%;
         display: flex;
         align-items: center;
         justify-content: center;
         font-size: 20px;
         color: #65676b;
         cursor: pointer;
         transition: background 0.2s ease;
     }

     .CloseButton:hover {
         background: #e4e6ea;
     }

     /* Sección de búsqueda */
     .SearchSection {
         padding: 20px 24px;
         border-bottom: 1px solid #e1e5e9;
     }

     .SearchInput {
         position: relative;
         display: flex;
         align-items: center;
     }

     .SearchInput input {
         width: 100%;
         padding: 12px 16px;
         border: 1px solid #e1e5e9;
         border-radius: 8px;
         font-size: 16px;
         outline: none;
         transition: border-color 0.2s ease;
     }

     .SearchInput input:focus {
         border-color: #1877f2;
     }

     .ClearButton {
         position: absolute;
         right: 8px;
         width: 24px;
         height: 24px;
         border: none;
         background: #e4e6ea;
         border-radius: 50%;
         color: #65676b;
         cursor: pointer;
         font-size: 14px;
         display: flex;
         align-items: center;
         justify-content: center;
         transition: background 0.2s ease;
     }

     .ClearButton:hover {
         background: #d0d7de;
     }

     .SearchHint {
         margin-top: 8px;
         font-size: 14px;
         color: #65676b;
         font-style: italic;
     }

     /* Sección de resultados */
     .ResultsSection {
         flex: 1;
         display: flex;
         flex-direction: column;
         min-height: 400px;
         max-height: 500px;
         overflow: hidden;
     }

     .LoadingState, .EmptyState, .ErrorState {
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;
         padding: 40px 20px;
         color: #65676b;
         text-align: center;
         flex: 1;
     }

     .LoadingSpinner {
         width: 40px;
         height: 40px;
         border: 3px solid #e4e6ea;
         border-top: 3px solid #1877f2;
         border-radius: 50%;
         animation: spin 1s linear infinite;
         margin-bottom: 16px;
     }

     @keyframes spin {
         0% { transform: rotate(0deg); }
         100% { transform: rotate(360deg); }
     }

     .EmptyIcon, .ErrorIcon {
         font-size: 48px;
         margin-bottom: 16px;
     }

     .EmptyState p, .ErrorState p {
         margin: 4px 0;
         line-height: 1.4;
     }

     .RetryButton {
         margin-top: 16px;
         padding: 8px 16px;
         background: #1877f2;
         color: white;
         border: none;
         border-radius: 6px;
         cursor: pointer;
         font-size: 14px;
         transition: background 0.2s ease;
     }

     .RetryButton:hover {
         background: #166fe5;
     }

     /* Container de resultados */
     .ResultsContainer {
         flex: 1;
         display: flex;
         flex-direction: column;
         overflow: hidden;
     }

     .ResultsList {
         flex: 1;
         overflow-y: auto;
         padding: 0 24px;
     }

     /* Items de tracks */
     .TrackItem {
         display: flex;
         align-items: center;
         gap: 16px;
         padding: 12px;
         border-radius: 8px;
         cursor: pointer;
         transition: all 0.2s ease;
         margin-bottom: 8px;
         border: 2px solid transparent;
         position: relative;
     }

     .TrackItem::before {
         content: '👆 Click para elegir';
         position: absolute;
         top: 50%;
         left: 50%;
         transform: translate(-50%, -50%);
         background: rgba(24, 119, 242, 0.9);
         color: white;
         padding: 4px 8px;
         border-radius: 4px;
         font-size: 12px;
         font-weight: 600;
         opacity: 0;
         pointer-events: none;
         transition: opacity 0.2s ease;
         z-index: 10;
     }

     .TrackItem:hover {
         background: #f8f9fa;
         transform: translateY(-2px);
         box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
     }

     .TrackItem:hover::before {
         opacity: 1;
     }

     .TrackItem.selected {
         background: #e3f2fd;
         border-color: #1877f2;
         transform: translateY(-2px);
         box-shadow: 0 4px 12px rgba(24, 119, 242, 0.2);
     }

     .TrackItem.selected::before {
         content: '✅ Seleccionado';
         background: rgba(0, 184, 148, 0.9);
         opacity: 1;
     }

     .TrackCover {
         position: relative;
         width: 60px;
         height: 60px;
         border-radius: 8px;
         overflow: hidden;
         flex-shrink: 0;
     }

     .TrackCover img {
         width: 100%;
         height: 100%;
         object-fit: cover;
     }

     .PlayOverlay {
         position: absolute;
         top: 0;
         left: 0;
         right: 0;
         bottom: 0;
         background: rgba(0, 0, 0, 0.5);
         display: flex;
         align-items: center;
         justify-content: center;
         opacity: 0;
         transition: opacity 0.2s ease;
     }

     .TrackItem:hover .PlayOverlay {
         opacity: 1;
     }

     .PlayIcon {
         color: white;
         font-size: 20px;
     }

     .TrackInfo {
         flex: 1;
         display: flex;
         flex-direction: column;
         gap: 4px;
         min-width: 0;
     }

     .TrackTitle {
         font-weight: 600;
         font-size: 14px;
         color: #1c1e21;
         white-space: nowrap;
         overflow: hidden;
         text-overflow: ellipsis;
     }

     .TrackArtist {
         font-size: 13px;
         color: #65676b;
         white-space: nowrap;
         overflow: hidden;
         text-overflow: ellipsis;
     }

     .TrackAlbum {
         font-size: 12px;
         color: #8a8d91;
         white-space: nowrap;
         overflow: hidden;
         text-overflow: ellipsis;
     }

     .TrackDuration {
         font-size: 12px;
         color: #65676b;
         font-weight: 500;
         width: 40px;
         text-align: center;
         flex-shrink: 0;
     }

     .TrackActions {
         flex-shrink: 0;
     }

     .SelectTrackBtn {
         background: #1877f2;
         color: white;
         border: none;
         padding: 6px 12px;
         border-radius: 6px;
         cursor: pointer;
         font-size: 12px;
         font-weight: 600;
         transition: background 0.2s ease;
         white-space: nowrap;
     }

     .SelectTrackBtn:hover {
         background: #166fe5;
     }

     .TrackItem.selected .SelectTrackBtn {
         background: #00b894;
     }

     .TrackItem.selected .SelectTrackBtn:hover {
         background: #00a085;
     }

     /* Footer del modal */
     .ModalFooter {
         display: flex;
         gap: 12px;
         justify-content: flex-end;
         padding: 20px 24px;
         border-top: 1px solid #e1e5e9;
         background: #f8f9fa;
     }

     .CancelButton {
         background: transparent;
         border: 1px solid #d0d7de;
         color: #656d76;
         padding: 10px 20px;
         border-radius: 6px;
         cursor: pointer;
         font-size: 14px;
         font-weight: 500;
         transition: all 0.2s ease;
     }

     .CancelButton:hover {
         background: #f6f8fa;
         border-color: #bcc5ce;
     }

     .SelectButton {
         background: #1877f2;
         color: white;
         border: none;
         padding: 10px 20px;
         border-radius: 6px;
         cursor: pointer;
         font-size: 14px;
         font-weight: 600;
         transition: background 0.2s ease;
         min-width: 120px;
     }

     .SelectButton:hover:not(:disabled) {
         background: #166fe5;
     }

     .SelectButton:disabled {
         background: #bcc0c4;
         cursor: not-allowed;
     }

     /* Scrollbar personalizada */
     .ResultsList::-webkit-scrollbar {
         width: 6px;
     }

     .ResultsList::-webkit-scrollbar-track {
         background: #f1f1f1;
         border-radius: 3px;
     }

     .ResultsList::-webkit-scrollbar-thumb {
         background: #c1c1c1;
         border-radius: 3px;
     }

     .ResultsList::-webkit-scrollbar-thumb:hover {
         background: #a1a1a1;
     }

     /* Responsive Design */
     @media (max-width: 768px) {
         .ModalOverlay {
             padding: 10px;
         }
         
         .ModalContainer {
             max-height: 90vh;
             border-radius: 12px;
         }
         
         .ModalHeader {
             padding: 16px 20px;
         }
         
         .SearchSection {
             padding: 16px 20px;
         }
         
         .ResultsList {
             padding: 0 20px;
         }
         
         .ModalFooter {
             padding: 16px 20px;
             flex-direction: column;
         }
         
         .CancelButton, .SelectButton {
             width: 100%;
         }
         
         .TrackItem {
             gap: 12px;
             padding: 10px;
         }
         
         .TrackCover {
             width: 50px;
             height: 50px;
         }
     }

     @media (max-width: 480px) {
         .ModalOverlay {
             padding: 0;
             align-items: flex-end;
         }
         
         .ModalContainer {
             max-height: 95vh;
             border-radius: 12px 12px 0 0;
             margin-bottom: 0;
         }
         
         .SearchInput input {
             font-size: 16px; /* Prevenir zoom en iOS */
         }
         
         .TrackItem {
             gap: 10px;
             padding: 8px;
         }
         
         .TrackCover {
             width: 45px;
             height: 45px;
         }
         
         .TrackTitle {
             font-size: 13px;
         }
         
         .TrackArtist {
             font-size: 12px;
         }
         
         .TrackAlbum {
             font-size: 11px;
         }
           }
    `,

   'musicPlayerCard': `
     /* Estilos para MusicPlayerCard */
     .MusicCard {
         background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
         border-radius: 12px;
         padding: 16px;
         margin: 12px 0;
         position: relative;
         overflow: hidden;
         color: white;
         display: flex;
         align-items: center;
         gap: 16px;
         min-height: 80px;
         transition: transform 0.2s ease, box-shadow 0.2s ease;
     }

     .MusicCard:hover {
         transform: translateY(-2px);
         box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
     }

     .MusicCard::before {
         content: '';
         position: absolute;
         top: 0;
         left: 0;
         right: 0;
         bottom: 0;
         background: rgba(255, 255, 255, 0.1);
         backdrop-filter: blur(10px);
         z-index: 0;
     }

     .MusicCard > * {
         position: relative;
         z-index: 1;
     }

     .MusicCover {
         position: relative;
         width: 64px;
         height: 64px;
         border-radius: 8px;
         overflow: hidden;
         flex-shrink: 0;
         cursor: pointer;
         transition: transform 0.2s ease;
     }

     .MusicCover:hover {
         transform: scale(1.05);
     }

     .MusicCover img {
         width: 100%;
         height: 100%;
         object-fit: cover;
     }

     .PlayOverlay {
         position: absolute;
         top: 0;
         left: 0;
         right: 0;
         bottom: 0;
         background: rgba(0, 0, 0, 0.6);
         display: flex;
         align-items: center;
         justify-content: center;
         opacity: 0;
         transition: opacity 0.2s ease;
     }

     .MusicCover:hover .PlayOverlay {
         opacity: 1;
     }

     .PlayButton {
         width: 32px;
         height: 32px;
         border: none;
         background: rgba(255, 255, 255, 0.9);
         border-radius: 50%;
         display: flex;
         align-items: center;
         justify-content: center;
         cursor: pointer;
         transition: all 0.2s ease;
         color: #333;
     }

     .PlayButton:hover {
         background: white;
         transform: scale(1.1);
     }

     .PlayButton:disabled {
         background: rgba(255, 255, 255, 0.5);
         cursor: not-allowed;
         transform: none;
     }

     .PlayIcon {
         font-size: 14px;
         line-height: 1;
     }

     .MusicInfo {
         flex: 1;
         display: flex;
         flex-direction: column;
         gap: 4px;
         min-width: 0;
     }

     .MusicTitle {
         font-weight: 700;
         font-size: 16px;
         margin: 0;
         white-space: nowrap;
         overflow: hidden;
         text-overflow: ellipsis;
         text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
     }

     .MusicArtist {
         font-size: 14px;
         font-weight: 500;
         margin: 0;
         opacity: 0.9;
         white-space: nowrap;
         overflow: hidden;
         text-overflow: ellipsis;
         text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
     }

     .MusicAlbum {
         font-size: 12px;
         margin: 0;
         opacity: 0.7;
         white-space: nowrap;
         overflow: hidden;
         text-overflow: ellipsis;
         text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
     }

     .MusicDuration {
         font-size: 11px;
         margin-top: 2px;
         opacity: 0.8;
         font-weight: 500;
         text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
     }

     .MusicActions {
         flex-shrink: 0;
     }

     .MainPlayButton {
         background: rgba(255, 255, 255, 0.2);
         border: 2px solid rgba(255, 255, 255, 0.3);
         color: white;
         padding: 8px 16px;
         border-radius: 20px;
         cursor: pointer;
         font-size: 14px;
         font-weight: 600;
         display: flex;
         align-items: center;
         gap: 6px;
         transition: all 0.2s ease;
         backdrop-filter: blur(10px);
         text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
     }

     .MainPlayButton:hover {
         background: rgba(255, 255, 255, 0.3);
         border-color: rgba(255, 255, 255, 0.5);
         transform: scale(1.05);
     }

     .MainPlayButton.playing {
         background: rgba(255, 255, 255, 0.9);
         color: #333;
         border-color: rgba(255, 255, 255, 0.9);
         text-shadow: none;
     }

     .MainPlayButton.playing:hover {
         background: white;
         border-color: white;
     }

     .MainPlayButton:disabled {
         background: rgba(255, 255, 255, 0.1);
         border-color: rgba(255, 255, 255, 0.1);
         cursor: not-allowed;
         transform: none;
         opacity: 0.6;
     }

     .ButtonIcon {
         font-size: 12px;
         line-height: 1;
     }

     .ButtonText {
         font-size: 12px;
         font-weight: 600;
     }

     /* Variantes de color para diferentes posts */
     .MusicCard.variant-1 {
         background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
     }

     .MusicCard.variant-2 {
         background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
     }

     .MusicCard.variant-3 {
         background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
     }

     .MusicCard.variant-4 {
         background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
     }

     .MusicCard.variant-5 {
         background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
     }

     /* Responsive Design */
     @media (max-width: 768px) {
         .MusicCard {
             padding: 12px;
             gap: 12px;
             margin: 10px 0;
         }

         .MusicCover {
             width: 56px;
             height: 56px;
         }

         .MusicTitle {
             font-size: 14px;
         }

         .MusicArtist {
             font-size: 13px;
         }

         .MusicAlbum {
             font-size: 11px;
         }

         .MainPlayButton {
             padding: 6px 12px;
             font-size: 12px;
         }

         .ButtonText {
             display: none;
         }

         .ButtonIcon {
             font-size: 14px;
         }
     }

     @media (max-width: 480px) {
         .MusicCard {
             padding: 10px;
             gap: 10px;
             flex-wrap: wrap;
         }

         .MusicCover {
             width: 48px;
             height: 48px;
         }

         .MusicInfo {
             flex: 1;
             min-width: 150px;
         }

         .MusicActions {
             width: 100%;
             display: flex;
             justify-content: center;
         }

         .MainPlayButton {
             flex: 1;
             justify-content: center;
             max-width: 200px;
         }

         .ButtonText {
             display: inline;
         }
     }

     /* Animaciones */
     @keyframes pulse {
         0% { transform: scale(1); }
         50% { transform: scale(1.05); }
         100% { transform: scale(1); }
     }

     .MusicCard.playing .MusicCover {
         animation: pulse 2s ease-in-out infinite;
     }

     .MusicCard.loading .MainPlayButton {
         opacity: 0.7;
         pointer-events: none;
     }
   `,

   'cardUser': `
     /* Estilos modernos para CardUser */
     .Container {
         width: 100%;
         max-width: 800px;
         margin: 0 auto;
         padding: 20px;
     }

     .CardUser {
         background: white;
         border-radius: 16px;
         box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
         padding: 24px;
         display: flex;
         align-items: center;
         gap: 24px;
         border: 1px solid #e1e5e9;
         margin-bottom: 24px;
         transition: box-shadow 0.2s ease;
     }

     .CardUser:hover {
         box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
     }

     .UserIcon {
         width: 160px;
         height: 160px;
         border-radius: 50%;
         object-fit: cover;
         border: 4px solid #e1e5e9;
         transition: transform 0.3s ease;
         flex-shrink: 0;
     }

     .UserIcon:hover {
         transform: scale(1.05);
     }

     .UserInfo {
         flex: 1;
         display: flex;
         flex-direction: column;
         gap: 16px;
     }

     .UserInfo1 {
         display: flex;
         flex-direction: column;
         gap: 8px;
     }

     .UserName {
         font-size: 28px;
         font-weight: 700;
         color: #1c1e21;
         margin: 0;
         line-height: 1.2;
     }

     .UserDescription {
         font-size: 16px;
         color: #65676b;
         margin: 0;
         line-height: 1.4;
         font-style: italic;
     }

     .UserStats {
         display: flex;
         gap: 24px;
         margin-top: 12px;
         flex-wrap: wrap;
     }

     .StatItem {
         font-size: 14px;
         color: #65676b;
     }

     .StatItem strong {
         color: #1c1e21;
         font-weight: 600;
     }

     .UserInfo2 {
         display: flex;
         flex-direction: column;
         gap: 12px;
     }

     .UserEmail {
         font-size: 14px;
         color: #65676b;
         margin: 0;
         display: flex;
         align-items: center;
         gap: 8px;
     }

     .EditProfileButton {
         background: #FFC7C8;
         color: white;
         border: none;
         padding: 12px 24px;
         border-radius: 8px;
         font-size: 14px;
         font-weight: 600;
         cursor: pointer;
         transition: background 0.2s ease;
         display: flex;
         align-items: center;
         gap: 8px;
         justify-content: center;
         max-width: 200px;
     }

     .EditProfileButton:hover {
         background:rgb(218, 171, 172);
     }

     .EditProfileButton:active {
         transform: scale(0.98);
     }

     /* Estados de carga */
     .LoadingState {
         display: flex;
         flex-direction: column;
         align-items: center;
         padding: 40px 20px;
         color: #65676b;
         text-align: center;
     }

     .LoadingSpinner {
         width: 40px;
         height: 40px;
         border: 3px solid #e4e6ea;
         border-top: 3px solid #1877f2;
         border-radius: 50%;
         animation: spin 1s linear infinite;
         margin-bottom: 16px;
     }

     @keyframes spin {
         0% { transform: rotate(0deg); }
         100% { transform: rotate(360deg); }
     }

     /* Responsive Design */
     @media (max-width: 768px) {
         .Container {
             padding: 16px;
         }

         .CardUser {
             flex-direction: column;
             text-align: center;
             padding: 20px;
         }

         .UserIcon {
             width: 120px;
             height: 120px;
         }

         .UserName {
             font-size: 24px;
         }

         .UserStats {
             justify-content: center;
             gap: 16px;
         }

         .EditProfileButton {
             max-width: none;
             width: 100%;
         }
     }

     @media (max-width: 480px) {
         .Container {
             padding: 12px;
         }

         .CardUser {
             padding: 16px;
         }

         .UserIcon {
             width: 100px;
             height: 100px;
         }

         .UserName {
             font-size: 20px;
         }

         .UserDescription {
             font-size: 14px;
         }

         .UserStats {
             gap: 12px;
         }

         .StatItem {
             font-size: 13px;
         }

                   .UserEmail {
              font-size: 13px;
          }
      }
    `,

    'userPostsFeed': `
      /* Estilos específicos para UserPostsFeed */
      .UserPostsHeader {
          background: white;
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e1e5e9;
      }

      .UserPostsHeader h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1c1e21;
      }

      .CreateFirstPostButton {
          display: inline-block;
          background: #1877f2;
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          margin-top: 16px;
          transition: background 0.2s ease;
      }

      .CreateFirstPostButton:hover {
          background: #166fe5;
      }

             /* Reutilizar estilos del PostFeed base */
     `,

     'editProfileModal': `
       /* Estilos para EditProfileModal */
       .ModalOverlay {
           position: fixed;
           top: 0;
           left: 0;
           right: 0;
           bottom: 0;
           background: rgba(0, 0, 0, 0.5);
           backdrop-filter: blur(4px);
           z-index: 1001;
           display: flex;
           align-items: center;
           justify-content: center;
           padding: 20px;
           animation: fadeIn 0.2s ease-out;
       }

       .ModalContainer {
           background: white;
           border-radius: 16px;
           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
           width: 100%;
           max-width: 500px;
           max-height: 90vh;
           display: flex;
           flex-direction: column;
           animation: slideIn 0.3s ease-out;
           overflow: hidden;
       }

       @keyframes fadeIn {
           from { opacity: 0; }
           to { opacity: 1; }
       }

       @keyframes slideIn {
           from { 
               opacity: 0;
               transform: translateY(-20px) scale(0.95);
           }
           to { 
               opacity: 1;
               transform: translateY(0) scale(1);
           }
       }

       .ModalHeader {
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: 20px 24px;
           border-bottom: 1px solid #e1e5e9;
           background: #f8f9fa;
       }

       .ModalHeader h3 {
           margin: 0;
           font-size: 18px;
           font-weight: 600;
           color: #1c1e21;
       }

       .CloseButton {
           width: 32px;
           height: 32px;
           border: none;
           background: transparent;
           border-radius: 50%;
           display: flex;
           align-items: center;
           justify-content: center;
           font-size: 20px;
           color: #65676b;
           cursor: pointer;
           transition: background 0.2s ease;
       }

       .CloseButton:hover {
           background: #e4e6ea;
       }

       .ModalContent {
           flex: 1;
           overflow-y: auto;
           padding: 24px;
       }

       .MessageContainer {
           margin-bottom: 16px;
           padding: 12px;
           border-radius: 8px;
           font-size: 14px;
           opacity: 0;
           transform: translateY(-10px);
           transition: all 0.3s ease;
           pointer-events: none;
       }

       .MessageContainer.visible {
           opacity: 1;
           transform: translateY(0);
           pointer-events: auto;
       }

       .MessageContainer.error {
           background: #ffe6e6;
           color: #d63031;
           border: 1px solid #fab1a0;
       }

       .MessageContainer.success {
           background: #e8f5e8;
           color: #00b894;
           border: 1px solid #a8e6cf;
       }

       /* Avatar Section */
       .AvatarSection {
           display: flex;
           flex-direction: column;
           align-items: center;
           margin-bottom: 24px;
           padding-bottom: 24px;
           border-bottom: 1px solid #e1e5e9;
       }

       .AvatarContainer {
           position: relative;
           margin-bottom: 16px;
       }

       .AvatarPreview {
           width: 120px;
           height: 120px;
           border-radius: 50%;
           object-fit: cover;
           border: 4px solid #e1e5e9;
           transition: all 0.2s ease;
       }

       .AvatarContainer:hover .AvatarPreview {
           border-color: #1877f2;
       }

       .AvatarOverlay {
           position: absolute;
           top: 0;
           left: 0;
           right: 0;
           bottom: 0;
           background: rgba(0, 0, 0, 0.5);
           border-radius: 50%;
           display: flex;
           align-items: center;
           justify-content: center;
           opacity: 0;
           transition: opacity 0.2s ease;
           cursor: pointer;
       }

       .AvatarContainer:hover .AvatarOverlay {
           opacity: 1;
       }

       .AvatarOverlay span {
           font-size: 24px;
       }

       .ImageInput {
           display: none;
       }

       .ChangePhotoButton {
           background: #f0f2f5;
           border: 1px solid #d0d7de;
           color: #1c1e21;
           padding: 8px 16px;
           border-radius: 6px;
           cursor: pointer;
           font-size: 14px;
           font-weight: 500;
           transition: all 0.2s ease;
       }

       .ChangePhotoButton:hover {
           background: #e4e6ea;
           border-color: #bcc5ce;
       }

       /* Form Fields */
       .FormFields {
           display: flex;
           flex-direction: column;
           gap: 20px;
           margin-bottom: 24px;
       }

       .FormGroup {
           display: flex;
           flex-direction: column;
           gap: 6px;
       }

       .FormGroup label {
           font-size: 14px;
           font-weight: 600;
           color: #1c1e21;
       }

       .FormGroup input,
       .FormGroup textarea {
           border: 1px solid #e1e5e9;
           border-radius: 8px;
           padding: 12px;
           font-size: 14px;
           font-family: inherit;
           outline: none;
           transition: border-color 0.2s ease;
       }

       .FormGroup input:focus,
       .FormGroup textarea:focus {
           border-color: #1877f2;
       }

       .BioInput {
           resize: vertical;
           min-height: 80px;
           max-height: 120px;
       }

       .CharacterCount {
           font-size: 12px;
           color: #65676b;
           text-align: right;
           margin-top: 4px;
           transition: color 0.2s ease;
       }

       .CharacterCount.limit-warning {
           color: #e17055;
       }

       .CharacterCount.limit-danger {
           color: #d63031;
           font-weight: 600;
       }

       /* Form Footer */
       .FormFooter {
           display: flex;
           gap: 12px;
           justify-content: flex-end;
           padding-top: 20px;
           border-top: 1px solid #e1e5e9;
       }

       .CancelButton {
           background: transparent;
           border: 1px solid #d0d7de;
           color: #656d76;
           padding: 10px 20px;
           border-radius: 6px;
           cursor: pointer;
           font-size: 14px;
           font-weight: 500;
           transition: all 0.2s ease;
       }

       .CancelButton:hover {
           background: #f6f8fa;
           border-color: #bcc5ce;
       }

       .SubmitButton {
           background: #1877f2;
           color: white;
           border: none;
           padding: 10px 20px;
           border-radius: 6px;
           cursor: pointer;
           font-size: 14px;
           font-weight: 600;
           transition: background 0.2s ease;
           min-width: 120px;
       }

       .SubmitButton:hover:not(:disabled) {
           background: #166fe5;
       }

       .SubmitButton:disabled {
           background: #bcc0c4;
           cursor: not-allowed;
       }

       /* Responsive Design */
       @media (max-width: 768px) {
           .ModalOverlay {
               padding: 10px;
           }

           .ModalContainer {
               max-height: 95vh;
               border-radius: 12px;
           }

           .ModalContent {
               padding: 20px;
           }

           .AvatarPreview {
               width: 100px;
               height: 100px;
           }

           .FormFooter {
               flex-direction: column;
           }

           .CancelButton,
           .SubmitButton {
               width: 100%;
           }
       }

       @media (max-width: 480px) {
           .ModalOverlay {
               padding: 0;
               align-items: flex-end;
           }

           .ModalContainer {
               max-height: 95vh;
               border-radius: 12px 12px 0 0;
               margin-bottom: 0;
           }

           .ModalHeader {
               padding: 16px 20px;
           }

           .ModalContent {
               padding: 16px 20px;
           }

           .AvatarPreview {
               width: 80px;
               height: 80px;
           }

           .FormGroup input,
           .FormGroup textarea {
               padding: 10px;
               font-size: 16px; /* Prevenir zoom en iOS */
           }
       }
     `
};

export const loadComponentCSS = (componentName: string): string => {
  return componentStyles[componentName] || '';
};

export const injectCSS = (shadowRoot: ShadowRoot, componentName: string): void => {
  const css = loadComponentCSS(componentName);
  if (css) {
    const styleElement = document.createElement('style');
    styleElement.textContent = css;
    shadowRoot.appendChild(styleElement);
  }
}; 

/**
 * Función auxiliar para obtener la URL del avatar con fallback
 */
export const getAvatarUrl = (avatarUrl?: string | null): string => {
  // Verificar si el avatar existe y no está vacío
  if (avatarUrl && avatarUrl.trim() !== '') {
    return avatarUrl;
  }
  // Devolver imagen por defecto si no hay avatar válido
  return '/imgs/logo/default-user-avatar.png';
};