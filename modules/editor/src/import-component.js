// @flow
/* eslint-env browser */

import React from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';

const Button = styled.button`
  display: inline-block;
  color: #fff;
  background-color: rgb(90, 98, 94);
  font-size: 1em;
  margin: 0.25em;
  padding: 0.375em 0.75em;
  border: 1px solid transparent;
  border-radius: 0.25em;
  display: block;
`;

const ImportComponentContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  outline: 0;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0.75rem 0.75rem;
  border-bottom: 1px solid rgb(222, 226, 230);
`;

const Header = styled.h5`
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0;
`;

const ImportContent = styled.div`
  width: auto;
  height: auto;
`;

const ImportSelect = styled.div`
  display: flex;
  padding: 0.75rem 0.75rem 0rem 0.75rem;
`;

const ImportArea = styled.div`
  box-sizing: border-box;
  display: block;
  width: auto;
  height: auto;
  min-height: 300px;
  padding: 0rem 1rem;
`;

const ImportInfo = styled.div`
  display: block;
  padding: 0rem 1rem;
`;

const FooterRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0.75rem 0.75rem;
  border-top: 1px solid rgb(222, 226, 230);
`;

export type ImportComponentProps = {
  onImport: any => mixed,
  onCancel: () => mixed
};

export function ImportComponent(props: ImportComponentProps) {
  const [isImportText, setIsImportText] = React.useState(true);
  const [text, setText] = React.useState('');
  const [importFile, setImportFile] = React.useState(null);

  const textAreaStyle = {
    padding: '0px',
    width: '100%',
    minHeight: '250px',
    height: '100%',
    border: '1px solid rgb(206, 212, 218)',
    borderRadius: '0.3rem'
  };

  function flush() {
    setImportFile(null);
    setText('');
    props.onCancel();
  }

  return (
    <ImportComponentContent>
      <HeaderRow>
        <Header>Import</Header>
      </HeaderRow>
      <ImportContent>
        <ImportSelect>
          <Button
            style={{
              backgroundColor: isImportText ? 'rgb(0, 105, 217)' : 'rgb(90, 98, 94)'
            }}
            onClick={() => {
              setIsImportText(true);
            }}
          >
            Import From Text
          </Button>
          <Button
            style={{
              backgroundColor: isImportText ? 'rgb(90, 98, 94)' : 'rgb(0, 105, 217)'
            }}
            onClick={() => {
              setIsImportText(false);
            }}
          >
            Import From File
          </Button>
        </ImportSelect>
        <ImportArea>
          {isImportText && (
            <TextareaAutosize
              style={textAreaStyle}
              rows={5}
              maxRows={25}
              onChange={event => setText(event.target.value)}
            />
          )}
          {!isImportText &&
            (!importFile ? (
              <Dropzone onDrop={importFiles => setImportFile(importFiles[0])}>
                {({ getRootProps, getInputProps }) => (
                  <div style={textAreaStyle} {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop your file here, or click to select a file.</p>
                  </div>
                )}
              </Dropzone>
            ) : (
              <div style={textAreaStyle}>Selected File: {importFile.name}</div>
            ))}
        </ImportArea>
        <ImportInfo>
          Supported formats:
          <ul style={{ marginTop: '0' }}>
            <li>
              <a
                href="https://tools.ietf.org/html/rfc7946"
                target="_blank"
                rel="noopener noreferrer"
                title="GeoJSON Specification"
              >
                GeoJSON
              </a>
            </li>
            <li>
              <a
                href="https://developers.google.com/kml/"
                target="_blank"
                rel="noopener noreferrer"
                title="KML Specification"
              >
                KML
              </a>
            </li>
            <li>
              <a
                href="https://en.wikipedia.org/wiki/Well-known_text"
                target="_blank"
                rel="noopener noreferrer"
                title="WKT"
              >
                WKT
              </a>
            </li>
          </ul>
        </ImportInfo>
      </ImportContent>
      <FooterRow>
        <Button
          style={{
            backgroundColor: text || importFile ? 'rgb(0, 105, 217)' : 'rgb(0, 123, 255)'
          }}
          onClick={() => {
            if (isImportText) {
              if (text) {
                props.onImport(JSON.parse(text));
              }
            } else if (importFile) {
              const fileReader = new FileReader();
              fileReader.onload = e => props.onImport(JSON.parse(e.target.result));
              fileReader.readAsText(importFile, 'utf8');
            }
            flush();
          }}
        >
          Import Geometry
        </Button>
        <Button onClick={flush}>Cancel</Button>
      </FooterRow>
    </ImportComponentContent>
  );
}
