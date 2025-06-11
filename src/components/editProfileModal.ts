import { loadComponentCSS, getAvatarUrl } from '../utils/cssLoader';
import { authStore, AuthActions } from '../flux';
import { authService } from '../services/authService';

interface EditProfileData {
    username: string;
    fullName: string;
    bio: string;
    avatar: string;
}

class EditProfileModal extends HTMLElement {
    private shadow: ShadowRoot;
    private isVisible = false;
    private isSubmitting = false;
    private currentData: EditProfileData | null = null;
    private selectedFile: File | null = null;
    private previewUrl: string | null = null;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        this.render();
        this.setupEventListeners();
    }

    // Método público para mostrar el modal
    public showModal(): void {
        const currentUser = authStore.getCurrentUser();
        if (!currentUser) {
            console.error('No hay usuario autenticado');
            return;
        }

        this.currentData = {
            username: currentUser.username || '',
            fullName: currentUser.fullName || '',
            bio: currentUser.bio || '',
            avatar: currentUser.avatar || ''
        };

        this.isVisible = true;
        this.render();
        document.body.style.overflow = 'hidden';
    }

    // Método público para ocultar el modal
    public hideModal(): void {
        this.isVisible = false;
        this.selectedFile = null;
        this.previewUrl = null;
        this.render();
        document.body.style.overflow = 'auto';
    }

    private setupEventListeners(): void {
        // Cerrar modal al hacer click en el overlay
        this.shadow.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('ModalOverlay')) {
                this.hideModal();
            }
        });

        // Cerrar modal con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hideModal();
            }
        });
    }

    private async handleSubmit(event: Event): Promise<void> {
        event.preventDefault();

        if (this.isSubmitting || !this.currentData) return;

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        const username = (formData.get('username') as string).trim();
        const fullName = (formData.get('fullName') as string).trim();
        const bio = (formData.get('bio') as string).trim();

        // Validaciones
        if (!username || username.length < 3) {
            this.showError('El nombre de usuario debe tener al menos 3 caracteres');
            return;
        }

        if (!fullName || fullName.length < 2) {
            this.showError('El nombre debe tener al menos 2 caracteres');
            return;
        }

        if (bio.length > 160) {
            this.showError('La biografía no puede tener más de 160 caracteres');
            return;
        }

        this.isSubmitting = true;
        this.updateSubmitButton(true);

        try {
            const currentUser = authStore.getCurrentUser();
            if (!currentUser) {
                throw new Error('Usuario no autenticado');
            }

            let avatarUrl = this.currentData.avatar;

            // Subir nueva imagen si se seleccionó
            if (this.selectedFile) {
                console.log('Subiendo nueva imagen de perfil...');
                avatarUrl = await authService.uploadProfileImage(this.selectedFile, currentUser.id);
            }

            // Actualizar perfil
            await authService.updateProfile(currentUser.id, {
                username,
                fullName,
                bio,
                avatar: avatarUrl
            });

            this.showSuccess('¡Perfil actualizado correctamente!');
            
            // Cerrar modal después de 2 segundos
            setTimeout(() => {
                this.hideModal();
            }, 2000);

        } catch (error: any) {
            console.error('Error updating profile:', error);
            this.showError(error.message || 'Error al actualizar el perfil');
        } finally {
            this.isSubmitting = false;
            this.updateSubmitButton(false);
        }
    }

    private handleImageChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) {
            this.selectedFile = null;
            this.previewUrl = null;
            this.updateImagePreview();
            return;
        }

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            this.showError('Por favor selecciona una imagen válida');
            input.value = '';
            return;
        }

        // Validar tamaño (5MB máximo)
        if (file.size > 5 * 1024 * 1024) {
            this.showError('La imagen no puede ser mayor a 5MB');
            input.value = '';
            return;
        }

        this.selectedFile = file;

        // Crear preview
        const reader = new FileReader();
        reader.onload = (e) => {
            this.previewUrl = e.target?.result as string;
            this.updateImagePreview();
        };
        reader.readAsDataURL(file);
    }

    private updateImagePreview(): void {
        const preview = this.shadow.querySelector('.AvatarPreview') as HTMLImageElement;
        if (preview) {
            if (this.previewUrl) {
                preview.src = this.previewUrl;
            } else if (this.currentData) {
                preview.src = getAvatarUrl(this.currentData.avatar);
            }
        }
    }

    private updateCharacterCount(): void {
        const bioInput = this.shadow.querySelector('.BioInput') as HTMLTextAreaElement;
        const counter = this.shadow.querySelector('.CharacterCount');
        
        if (bioInput && counter) {
            const count = bioInput.value.length;
            counter.textContent = `${count}/160`;
            counter.classList.toggle('limit-warning', count > 140);
            counter.classList.toggle('limit-danger', count > 160);
        }
    }

    private updateSubmitButton(isSubmitting: boolean): void {
        const submitBtn = this.shadow.querySelector('.SubmitButton') as HTMLButtonElement;
        if (submitBtn) {
            submitBtn.disabled = isSubmitting;
            submitBtn.textContent = isSubmitting ? 'Guardando...' : 'Guardar Cambios';
        }
    }

    private showError(message: string): void {
        this.showMessage(message, 'error');
    }

    private showSuccess(message: string): void {
        this.showMessage(message, 'success');
    }

    private showMessage(message: string, type: 'error' | 'success'): void {
        const messageContainer = this.shadow.querySelector('.MessageContainer');
        if (messageContainer) {
            messageContainer.className = `MessageContainer ${type}`;
            messageContainer.textContent = message;
            messageContainer.classList.add('visible');
        }
    }

    render(): void {
        if (!this.shadow) return;

        if (!this.isVisible || !this.currentData) {
            this.shadow.innerHTML = '';
            return;
        }

        const currentUser = authStore.getCurrentUser();
        if (!currentUser) {
            this.shadow.innerHTML = '';
            return;
        }

        this.shadow.innerHTML = `
            <style>
            ${loadComponentCSS('editProfileModal')}
            </style>
            <div class="ModalOverlay">
                <div class="ModalContainer">
                    <div class="ModalHeader">
                        <h3>Editar Perfil</h3>
                        <button class="CloseButton">&times;</button>
                    </div>

                    <div class="ModalContent">
                        <div class="MessageContainer"></div>
                        
                        <form class="EditForm">
                            <!-- Avatar Section -->
                            <div class="AvatarSection">
                                <div class="AvatarContainer">
                                    <img src="${this.previewUrl || getAvatarUrl(this.currentData.avatar)}" 
                                         alt="Avatar" 
                                         class="AvatarPreview">
                                    <div class="AvatarOverlay">
                                        <span>📷</span>
                                    </div>
                                </div>
                                <input type="file" 
                                       accept="image/*" 
                                       class="ImageInput" 
                                       id="avatar-input">
                                <label for="avatar-input" class="ChangePhotoButton">
                                    Cambiar Foto
                                </label>
                            </div>

                            <!-- Form Fields -->
                            <div class="FormFields">
                                <div class="FormGroup">
                                    <label for="username">Nombre de Usuario</label>
                                    <input type="text" 
                                           id="username" 
                                           name="username" 
                                           value="${this.currentData.username}"
                                           placeholder="Nombre de usuario"
                                           minlength="3"
                                           maxlength="30"
                                           required>
                                </div>

                                <div class="FormGroup">
                                    <label for="fullName">Nombre Completo</label>
                                    <input type="text" 
                                           id="fullName" 
                                           name="fullName" 
                                           value="${this.currentData.fullName}"
                                           placeholder="Tu nombre completo"
                                           minlength="2"
                                           maxlength="50"
                                           required>
                                </div>

                                <div class="FormGroup">
                                    <label for="bio">Biografía</label>
                                    <textarea id="bio" 
                                              name="bio" 
                                              class="BioInput"
                                              placeholder="Escribe algo sobre ti..."
                                              maxlength="160"
                                              rows="3">${this.currentData.bio}</textarea>
                                    <span class="CharacterCount">${this.currentData.bio.length}/160</span>
                                </div>
                            </div>

                            <div class="FormFooter">
                                <button type="button" class="CancelButton">Cancelar</button>
                                <button type="submit" class="SubmitButton">Guardar Cambios</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        this.setupModalEventListeners();
    }

    private setupModalEventListeners(): void {
        // Close button
        const closeBtn = this.shadow.querySelector('.CloseButton');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideModal());
        }

        // Cancel button
        const cancelBtn = this.shadow.querySelector('.CancelButton');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hideModal());
        }

        // Form submission
        const form = this.shadow.querySelector('.EditForm');
        if (form) {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        }

        // Image input
        const imageInput = this.shadow.querySelector('.ImageInput');
        if (imageInput) {
            imageInput.addEventListener('change', this.handleImageChange.bind(this));
        }

        // Bio character count
        const bioInput = this.shadow.querySelector('.BioInput');
        if (bioInput) {
            bioInput.addEventListener('input', () => this.updateCharacterCount());
        }
    }
}

if (!customElements.get('edit-profile-modal')) {
    customElements.define('edit-profile-modal', EditProfileModal);
}

export default EditProfileModal; 