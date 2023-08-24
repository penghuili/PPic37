import { Button, FileInput, Image, Text } from 'grommet';
import React, { useState } from 'react';

import { FILE_LIMIT } from '../../lib/constants';
import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import DatePicker from '../../shared/react-pure/DatePicker';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import TextEditor from '../../shared/react/TextEditor';

function PicAdd({ isCreating, onCreate, onToast }) {
  const [file, setFile] = useState(null);
  const [date, setDate] = useState(null);
  const [note, setNote] = useState('');

  function isImage(selectedFile) {
    return selectedFile.type.startsWith('image/');
  }

  function isTooLarge(selectedFile) {
    return selectedFile.size > FILE_LIMIT;
  }

  return (
    <>
      <AppBar title="Add friend" hasBack />
      <ContentWrapper>
        <Text weight="bold">Choose your profile pic</Text>
        <FileInput
          multiple={false}
          maxSize={FILE_LIMIT}
          onChange={async event => {
            const selected = event.target.files[0];
            if (!selected) {
              return;
            }

            if (!isImage(selected)) {
              onToast(`Please select an image.`);
            } else if (isTooLarge(selected)) {
              onToast(
                `File size limit is ${FILE_LIMIT / 1024 / 1024}MB, please select a smaller file.`
              );
            } else {
              setFile(selected);
            }
          }}
          renderFile={file => (
            <Text margin="0 0 0 1rem">
              {!isImage(file) || isTooLarge(file) ? 'Drop file here or' : file.name}
            </Text>
          )}
        />
        <Spacer />

        {!!file && <Image src={URL.createObjectURL(file)} alt="Profile pic" width="300px" />}
        <Spacer />

        <DatePicker label="Date" value={date} onChange={setDate} />
        <Spacer />

        <Text weight="bold">Where are you using this profile pic?</Text>
        <TextEditor text={note} onChange={setNote} />
        <Spacer />

        <Button
          label="Add profile pic"
          onClick={() => {
            onCreate({
              file,
              date: date ? date.getTime() : undefined,
              note,
              goBack: true,
            });
          }}
          disabled={!file || isCreating}
        />
      </ContentWrapper>
    </>
  );
}

export default PicAdd;
