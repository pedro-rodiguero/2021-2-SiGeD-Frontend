import React, { useEffect, useRef } from 'react';
import { MdAddAPhoto } from 'react-icons/md';
import {
  Sidebar, SidebarText, SidebarFooter, Img, ButtonPhoto,
  ChooseContainerPhoto, InputPhoto, TopPart,
} from './Style';

const SidebarComponent = ({
  sidebarList, sidebarFooter, inputImage, setInputImage, baseImage, setBaseImage,
}) => {
  const fileTest = useRef(null);
  const convertBase64 = (file) => new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });

  const uploadImage = async (e) => {
    const file = e?.target?.files[0];
    if (file) {
      const base64 = await convertBase64(file);
      setBaseImage(base64);
      setInputImage(baseImage);
    }
  };

  const translateRole = (role) => {
    const rolesDict = { admin: 'Administrador', professional: 'Profissional', receptionist: 'Recepcionista' };
    return rolesDict[role] ? rolesDict[role] : role;
  };

  useEffect(() => {
    setInputImage(baseImage);
  }, [baseImage]);

  const renderImage = () => {
    if (!inputImage) {
      return (
        <TopPart>
          <ChooseContainerPhoto
            onClick={() => { fileTest.current.click(); }}
          >
            <ButtonPhoto className="submit-lente" type="submit">
              <MdAddAPhoto size="100%" />
            </ButtonPhoto>
          </ChooseContainerPhoto>
          <InputPhoto
            type="file"
            ref={fileTest}
            onChange={(e) => {
              uploadImage(e);
            }}
          />
        </TopPart>
      );
    }
    return (
      <TopPart>
        <Img
          src={inputImage}
          alt="Foto"
          onClick={() => { fileTest.current.click(); }}
        />
        <InputPhoto
          type="file"
          ref={fileTest}
          onChange={(e) => {
            uploadImage(e);
          }}
        />
      </TopPart>
    );
  };

  return (
    <Sidebar>
      {renderImage()}
      <SidebarText>
        {
          sidebarList.map((cardText, index) => <p key={index}>{translateRole(cardText)}</p>)
        }
      </SidebarText>
      { sidebarFooter
        && (
          <SidebarFooter
            style={{ marginTop: '3vh' }}
          >
            {sidebarFooter.map((sidebarCardFooterText, index) => (
              <p style={{ fontSize: '2vh' }} key={index}>
                {sidebarCardFooterText}
              </p>
            ))}
          </SidebarFooter>
        )}
    </Sidebar>
  );
};

export default SidebarComponent;
