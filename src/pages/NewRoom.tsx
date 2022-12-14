import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { v4 as uuidv4 } from 'uuid';

import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { ref, set } from 'firebase/database';

import { Button } from '../components/Button';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import '../styles/auth.scss';

export function NewRoom() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [newRoom, setNewRoom] = useState('');

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if (newRoom.trim() === '') {
      return;
    }
    const roomId = uuidv4();

    const roomRef = ref(database, `rooms/${roomId}`);
    await set(roomRef, {
      title: newRoom,
      authorId: user?.id,
    });
    navigate(`/rooms/${roomId}`);
  }

  return (
    <div id='page-auth'>
      <aside>
        <img
          src={illustrationImg}
          alt='Ilustração simbolizando perguntas e respostas'
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className='main-content'>
          <img src={logoImg} alt='Letmeask' />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type='text'
              placeholder='Nome da sala'
              value={newRoom}
              onChange={(event) => setNewRoom(event.target.value)}
            />
            <Button type='submit'>Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to='/'>clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
