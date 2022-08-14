import { ref, remove, set, update } from 'firebase/database';

import { Link, useNavigate, useParams } from 'react-router-dom';

import { database } from '../services/firebase';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import '../styles/room.scss';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  // const { user } = useAuth();
  const navigate = useNavigate();

  const { id } = useParams<RoomParams>();
  const roomId = id || '';

  const { questions, title } = useRoom(roomId);

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      const questionRef = ref(
        database,
        `rooms/${roomId}/questions/${questionId}`
      );
      await remove(questionRef);
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    const questionRef = ref(
      database,
      `rooms/${roomId}/questions/${questionId}`
    );
    await update(questionRef, { isAnswered: true });
  }

  async function handleHighlightQuestion(questionId: string) {
    const questionRef = ref(
      database,
      `rooms/${roomId}/questions/${questionId}`
    );
    await update(questionRef, { isHighlighted: true });
  }

  async function handleEndRoom() {
    const roomToEnd = ref(database, `rooms/${roomId}`);
    await update(roomToEnd, {
      endedAt: new Date(),
    });
    navigate('/');
  }

  return (
    <div id='page-room'>
      <header>
        <div className='content'>
          <Link to='/'>
            <img src={logoImg} alt='' />
          </Link>
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main className='content'>
        <div className='room-title'>
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className='question-list'>
          {questions.map((question) => (
            <Question
              key={question.id}
              author={question.author}
              content={question.content}
              isHighlighted={question.isHighlighted}
              isAnswered={question.isAnswered}
            >
              {!question.isAnswered && (
                <>
                  <button
                    type='button'
                    onClick={() => handleCheckQuestionAsAnswered(question.id)}
                  >
                    <img src={checkImg} alt='Marcar pergunta como respondida' />
                  </button>
                  <button
                    type='button'
                    onClick={() => handleHighlightQuestion(question.id)}
                  >
                    <img src={answerImg} alt='Dar destaque à pergunta' />
                  </button>
                </>
              )}
              <button
                type='button'
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt='Remover pergunta' />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
}
