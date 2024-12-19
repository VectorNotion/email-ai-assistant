import { Card, CardBody, Stack, StackDivider } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEmailContext } from '../context/EmailContext';

export default function EmailDetails() {
  // get the id from the nav router
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeEmail, setActiveEmail } = useEmailContext();
  const goBack = () => {
    // pop the last route from the history stack of react-router-dom
    navigate(-1);
  };

  useEffect(() => {
    window.electron.ipcRenderer
      .invoke('get-email', id)
      .then((email) => {
        console.log(email);
        setActiveEmail(email);
        return email;
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      setActiveEmail(null);
    };
  }, [id, setActiveEmail]);

  return (
    <Card w="100%">
      <CardBody onClick={goBack}>
        <Stack divider={<StackDivider />} spacing="4" minH="100vh">
          <iframe
            srcDoc={activeEmail?.rawBody}
            width="100%"
            height="100%"
            style={{
              minHeight: '100vh',
            }}
            title="Hello WOlrd"
          />
        </Stack>
      </CardBody>
    </Card>
  );
}
