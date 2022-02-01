import express, { Response } from 'express';
import { WebsocketRequestHandler } from 'express-ws';
import { Descendant } from 'slate';
import { v4 as id } from 'uuid';
import firebase from '../firebase';
// Patch `express.Router` to support `.ws()` without needing to pass around a `ws`-ified app.
// https://github.com/HenningM/express-ws/issues/86
// eslint-disable-next-line @typescript-eslint/no-var-requires
const patch = require('express-ws/lib/add-ws-method');
patch.default(express.Router);

const router = express.Router();

export interface NotesResponse {
  notes: Array<{
    id: string;
    title: string;
  }>;
}

export interface NoteResponse {
  id: string;
  title: string;
  content: Array<Descendant>;
}

const notesHandler: WebsocketRequestHandler = async (ws) => {
  ws.on('message', async () => {
    await firebase.collection('Notes').onSnapshot((snapshot) => {
      const notes = snapshot.docs.map((doc) => doc.data());
      return ws.send(JSON.stringify({ notes }));
    });
  });
};

const noteHandler: WebsocketRequestHandler = (ws, req) => {
  ws.on('message', async () => {
    const snapshot = await firebase.doc('Notes/' + req.params.id).get();
    return ws.send(JSON.stringify(snapshot.data()));
  });
};

const postHandler = ({ body }: { body: NoteResponse }, res: Response) => {
  const collectionName = 'Notes';
  const docName = id();
  const documentToAdd = collectionName + '/' + docName;

  if (body.title) {
    const document = firebase.doc(documentToAdd);

    document
      .set({
        title: body.title,
        id: docName,
      })
      .then(() => {
        res.json({
          id: docName,
          title: body.title,
        });
      });
  }
};

router.ws('/', notesHandler);
router.post('/', postHandler);
router.ws('/:id', noteHandler);

export default router;
