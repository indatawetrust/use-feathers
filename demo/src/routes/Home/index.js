import React, { useEffect, useState } from 'react';
import { useFeathers } from '@cond/use-feathers';
import {
  InputGroup,
  InputGroupAddon,
  Input,
  Button,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';

const Home = () => {
  const [todoText, setTodoText] = useState('');
  const [isEdit, setIsEdit] = useState({});
  const [editTexts, setEditTexts] = useState({});
  const { useFind, usePatch, useRemove, useCreate } = useFeathers();

  const { findAction, state: findState } = useFind('todo');

  const { patchAction, state: patchState } = usePatch('todo');

  const { createAction, state: createState } = useCreate('todo');

  const { removeAction, state: removeState } = useRemove('todo');

  useEffect(() => {
    findAction();
  }, []);

  useEffect(() => {
    if (createState.isLoaded || removeState.isLoaded || patchState.isLoaded) {
      findAction();
    }

    if (createState.isLoaded) {
      setTodoText('');
    }

    if (patchState.isLoaded) {
      delete isEdit[patchState.data._id];
      setIsEdit({
        ...isEdit,
      });
      delete editTexts[patchState.data._id];
      setEditTexts({
        ...editTexts,
      });
    }
  }, [createState, removeState, patchState]);

  const handleSave = () => {
    if (todoText?.trim().length) {
      createAction({
        text: todoText,
      });
    }
  };

  const handleRemove = (itemId) => {
    removeAction(itemId);
  };

  const handleEdit = (itemId) => {
    setIsEdit({
      ...isEdit,
      [itemId]: true,
    });
  };

  const handleEditClose = (itemId) => {
    delete isEdit[itemId];
    setIsEdit({
      ...isEdit,
    });
  };

  const handleEditSave = (itemId) => {
    patchAction(itemId, {
      text: editTexts[itemId],
    });
  };

  const handleEditInput = (e, itemId) => {
    setEditTexts({
      ...isEdit,
      [itemId]: e.target.value,
    });
  };

  return (
    <div>
      <InputGroup>
        <Input
          placeholder="todo..."
          type="text"
          onInput={(e) => setTodoText(e.target.value)}
          value={todoText}
        />
        <InputGroupAddon addonType="append">
          <Button onClick={handleSave} disabled={!todoText?.trim().length}>
            save
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <div>
        {findState.isPending && (
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        )}
        <ListGroup>
          {!findState.data.data.length && (
            <ListGroupItem>no data</ListGroupItem>
          )}
          {findState.data.data.map((item) => (
            <ListGroupItem>
              <div className="row">
                {isEdit[item._id] ? (
                  <Input
                    defaultValue={item.text}
                    onInput={(e) => handleEditInput(e, item._id)}
                  />
                ) : (
                  item.text
                )}
              </div>
              <div className="row d-flex justify-content-end mt-2 border-top pt-2">
                {isEdit[item._id] && (
                  <Button
                    className="mr-2"
                    size="sm"
                    color="success"
                    onClick={() => handleEditSave(item._id)}
                  >
                    save
                  </Button>
                )}
                <Button
                  className="mr-2"
                  size="sm"
                  color="info"
                  onClick={() =>
                    isEdit[item._id]
                      ? handleEditClose(item._id)
                      : handleEdit(item._id)
                  }
                >
                  {isEdit[item._id] ? 'close' : 'edit'}
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  onClick={() => handleRemove(item._id)}
                >
                  remove
                </Button>
              </div>
            </ListGroupItem>
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default Home;
