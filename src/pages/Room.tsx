import { ref, set } from 'firebase/database';
import { FormEvent, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { useParams } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import logoImg from '../assets/images/logo.svg';

import '../styles/room.scss';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';

type RoomParams = {
  id: string;
};

export function Room() {
  const { user } = useAuth();

  const { id } = useParams<RoomParams>();
  const roomId = id || '';

  const { questions, title } = useRoom(roomId);

  const [newQuestion, setNewQuestion] = useState('');

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('You must be logged in');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    const roomRef = ref(database, `rooms/${roomId}/questions/${uuidv4()}`);
    await set(roomRef, question);
    setNewQuestion('');
  }

  return (
    <div id='page-room'>
      <header>
        <div className='content'>
          <img src={logoImg} alt='' />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main className='content'>
        <div className='room-title'>
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder='O que você quer perguntar?'
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className='form-footer'>
            {user ? (
              <div className='user-info'>
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button>faça seu login</button>.
              </span>
            )}
            <Button type='submit' disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>

        <div className='question-list'>
          {questions.map((question) => (
            <Question
              key={question.id}
              author={question.author}
              content={question.content}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
