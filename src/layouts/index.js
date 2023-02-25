import { Container, Paper } from '@mui/material';
import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { setActivationProfile } from 'stores/account';

import useGet from 'hooks/axios/useGet';
import profileService from 'data/jsons/services/profile.service.json';

import Header from 'layouts/Header';
import Body from 'layouts/Body';
import Footer from 'layouts/Footer';

import Loading from 'pages/loading';

const Application = ({ header, body, footer }) => {
  const dispatch = useDispatch();

  const [getActivationAction, getActivationLoading, getActivationData] = useGet(
    profileService.getActivation
  );

  useEffect(() => {
    getActivationAction().then((res) => {
      const primary = res.data.primary;
      const secondary = res.data.secondary;
      dispatch(
        setActivationProfile({
          primaryProfile: primary,
          secondaryProfile: secondary,
        })
      );
    });
  }, [getActivationAction, dispatch]);

  return (
    <>
      <Container>
        <Paper elevation={3}>
          {!getActivationData || getActivationLoading ? (
            <Loading />
          ) : (
            <>
              <Header component={header} />
              <Body component={body} />
              <Footer component={footer} />
            </>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default Application;