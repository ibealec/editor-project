// @ts-ignore
import { Server } from '@hocuspocus/server';
import { slateNodesToInsertDelta, yTextToSlateElement } from '@slate-yjs/core';
import cors from 'cors';
import express from 'express';
import expressWs from 'express-ws';
import * as Y from 'yjs';
import firebase from './firebase';
import apiRoutes from './routes';
const app = express();
const PORT = 3001;
expressWs(app);
const initialValue = [{ type: 'paragraph', children: [{ text: '' }] }];

const server = Server.configure({
  port: 1234,
  // extensions: [new Logger()],
  async onChange(data) {
    const sharedRoot = data.document.get('content', Y.XmlText);
    const collectionName = 'Notes';

    // @ts-ignore
    const docName = sharedRoot.doc.name;
    const documentToAdd = collectionName + '/' + docName;
    const document = firebase.doc(documentToAdd);
    document
      .update({
        // @ts-ignore
        content: [yTextToSlateElement(sharedRoot)],
      })
      .then(() => {})
      .catch((e) => {
        console.log('error', e);
      });
  },
  async onLoadDocument(data) {
    setTimeout(async () => {
      if (data.document.isEmpty('content')) {
        const sharedRoot = data.document.get('content', Y.XmlText);
        const collectionName = 'Notes';
        // @ts-ignore
        const docName = sharedRoot.doc.name;
        const documentToAdd = collectionName + '/' + docName;
        const document = await firebase.doc(documentToAdd).get();
        const docData = document.data();
        if (docData?.content) {
          const insertDelta = slateNodesToInsertDelta(docData.content);
          // @ts-ignore
          sharedRoot.applyDelta(insertDelta);
        } else {
          sharedRoot
            //@ts-ignore
            .applyDelta(slateNodesToInsertDelta(initialValue));
        }
      }

      return data.document;
    }, 300);
  },
});

// Start the server
// server.enableMessageLogging();
server.listen();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
