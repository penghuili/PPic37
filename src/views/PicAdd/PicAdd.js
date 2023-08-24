import { Button, FileInput, Image, Text } from 'grommet';
import React, { useState } from 'react';

import ContentWrapper from '../../shared/react-pure/ContentWrapper';
import Spacer from '../../shared/react-pure/Spacer';
import AppBar from '../../shared/react/AppBar';
import TextEditor from '../../shared/react/TextEditor';
import DatePicker from '../../shared/react-pure/DatePicker';

function PicAdd({ isCreating, onCreate }) {
  const [file, SetFile] = useState(null);
  const [date, setDate] = useState(null);
  const [note, setNote] = useState('');

  return (
    <>
      <AppBar title="Add friend" hasBack />
      <ContentWrapper>
        <Text weight="bold">Choose your profile pic</Text>
        <FileInput
          multiple={false}
          onChange={async event => {
            const file = event.target.files[0];
            SetFile(file);
          }}
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
