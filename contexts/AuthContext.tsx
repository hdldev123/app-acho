import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/services/firebase';
import { getMeuPerfil } from '@/services/userService';
import { Usuario } from '@/types';

interface AuthContextData {
  /** Dados do perfil vindos da API .NET */
  usuario: Usuario | null;
  /** Usuário raw do Firebase Auth (para tokens, etc.) */
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listener do Firebase Auth — dispara em login/logout/refresh
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        try {
          // Busca o perfil completo na API .NET
          const perfil = await getMeuPerfil();
          setUsuario(perfil);
        } catch (error) {
          console.error('Erro ao carregar perfil do usuário:', error);
          setUsuario(null);
        }
      } else {
        setUsuario(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // O listener onAuthStateChanged cuida do resto
  };

  const signUp = async (email: string, password: string, _name: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
    // Após criar no Firebase, o backend .NET criará o registro
    // do usuário automaticamente no primeiro request autenticado,
    // ou você pode chamar a API de cadastro aqui se necessário.
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        firebaseUser,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};