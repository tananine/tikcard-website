import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  Fade,
  Grow,
  Typography,
  Skeleton,
} from '@mui/material';
import { Img } from 'react-image';
import { useParams } from 'react-router-dom';

import PersonAddIcon from '@mui/icons-material/PersonAdd';

import openAppUri from '@/functions/openAppUri';
import saveVCard from '@/functions/saveVCard';

import Lead from '@/pages/view/Lead';

import GridLayout from '@/components/layoutContact/GridLayout';
import BlockLayout from '@/components/layoutContact/BlockLayout';
import SpacialLayout from '@/components/layoutContact/spacials';

import Logo from '@/assets/images/logo.png';
import Verify from '@/assets/images/verify.png';

import splitCoverImage from '@/functions/getCoverImage';

const jobTitle = (job, company) => {
  if (job && company) {
    return `${job} ที่ ${company}`;
  } else if (job) {
    return job;
  } else {
    return company;
  }
};

const ContactLists = (contactItems) => {
  return contactItems?.map((section) => {
    switch (section.typeLayout) {
      case 'grid':
        return (
          <Grid
            key={section.id}
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1.5, md: 2, lg: 3 }}
            marginY={{ xs: 1, md: 1.5, lg: 2 }}
            paddingX={{ xs: 1, md: 1.5, lg: 2 }}
          >
            {section.contacts?.map((item) => {
              return (
                <Grid key={item.id} item xs={3} textAlign="center">
                  <GridLayout
                    onClick={() =>
                      openAppUri(
                        item.ContactItem.defaultUri,
                        item.ContactItem.androidUri,
                        item.ContactItem.iosUri,
                        item.data
                      )
                    }
                    imageIcon={item.ContactItem.imageIcon}
                    title={item.ContactItem.name}
                  />
                </Grid>
              );
            })}
          </Grid>
        );
      case 'block':
        return section.contacts?.map((item) => {
          return (
            <Box key={item.id} width="100%" marginY={{ xs: 1, md: 1.5, lg: 2 }}>
              <BlockLayout
                onClick={() =>
                  openAppUri(
                    item.ContactItem.defaultUri,
                    item.ContactItem.androidUri,
                    item.ContactItem.iosUri,
                    item.data
                  )
                }
                title={item.ContactItem.name}
                imageIcon={item.ContactItem.imageIcon}
                name={item.name}
                note={item.note}
              />
            </Box>
          );
        });
      case 'spacial':
        return section.contacts?.map((item) => {
          return (
            <Box key={item.id} width="100%" marginY={{ xs: 1, md: 1.5, lg: 2 }}>
              <SpacialLayout data={item} />
            </Box>
          );
        });
      default:
        return <></>;
    }
  });
};

const View = ({ isPreview, profileData }) => {
  const [contactItems, setContactItems] = useState([]);

  const { linkId } = useParams();

  const setListContactItems = () => {
    const contactSection = [];
    let contactList = [];

    const pushContactSection = () => {
      contactSection.push({
        id: contactSection.length,
        typeLayout: contactList[0].ContactItem.typeLayout,
        contacts: contactList,
      });
    };

    profileData?.contacts.forEach((contact, index) => {
      if (index === 0) {
        contactList.push(contact);
        if (profileData.contacts.length - 1 === 0) {
          pushContactSection();
        }
        return;
      }
      const lastIndexItem = contactList.length - 1;
      if (
        contactList[lastIndexItem]?.ContactItem.typeLayout ===
        contact?.ContactItem.typeLayout
      ) {
        contactList.push(contact);
      } else {
        pushContactSection();
        contactList = [];
        contactList.push(contact);
      }
      if (index === profileData.contacts.length - 1) {
        pushContactSection();
      }
    });
    setContactItems(contactSection);
  };

  useEffect(() => {
    setListContactItems();
  }, [profileData, setContactItems]);

  const goNewCreate = () => {
    window.open('/app/login');
  };

  const saveVCardHandler = () => {
    saveVCard('landing', profileData, linkId);
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box marginBottom={8}>
        <Box
          height={180}
          sx={{ borderBottomRightRadius: 60, overflow: 'hidden' }}
        >
          <Img
            src={
              profileData?.info.Profile &&
              splitCoverImage(
                profileData?.info.Profile.coverImage,
                profileData?.info.Profile.colorCoverImage
              )
            }
            alt="cover image"
            width="100%"
            height="100%"
            loader={
              <Skeleton
                animation="wave"
                variant="rounded"
                width="100%"
                height="100%"
              />
            }
            unloader={
              <Skeleton
                animation="wave"
                variant="rounded"
                width="100%"
                height="100%"
              />
            }
          />
        </Box>
        <Grow
          in={true}
          sx={{
            position: 'absolute',
            left: 20,
            top: isPreview ? 135 : 75,
          }}
          timeout={{ enter: 1000 }}
        >
          <Box>
            <Box sx={{ border: '4px solid white', borderRadius: '50%' }}>
              <Avatar
                sx={{
                  width: 130,
                  height: 130,
                  boxShadow:
                    'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em',
                }}
              >
                <Img
                  src={profileData?.info.profileImage}
                  alt=""
                  width="100%"
                  height="100%"
                  loader={
                    <Skeleton
                      animation="wave"
                      variant="rounded"
                      width="100%"
                      height="100%"
                    />
                  }
                  unloader={<Avatar sx={{ width: 60, height: 60 }} />}
                />
              </Avatar>
            </Box>
            {profileData?.info.logoImage && (
              <Box
                sx={{
                  border: '2px solid white',
                  borderRadius: '50%',
                  position: 'absolute',
                  left: 100,
                  top: 80,
                }}
              >
                <Avatar
                  sx={{
                    width: 52,
                    height: 52,
                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 2px 0px',
                  }}
                >
                  <Img
                    src={profileData?.info.logoImage}
                    alt=""
                    width="100%"
                    height="100%"
                    loader={
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width="100%"
                        height="100%"
                      />
                    }
                    unloader={
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width="100%"
                        height="100%"
                      />
                    }
                  />
                </Avatar>
              </Box>
            )}
          </Box>
        </Grow>
        <Box padding={2} minHeight={500}>
          <Fade in={true} timeout={{ enter: 1000 }}>
            <Box marginBottom={2}>
              <Box px={2} marginBottom={2}>
                <Typography
                  marginTop={5}
                  textAlign="center"
                  alignSelf="center"
                  variant="h1"
                  sx={{ lineBreak: 'anywhere' }}
                >
                  {profileData?.info.name || 'ไม่มีชื่อ'}
                  {false && ( // TODO: Icon verify
                    <Img
                      src={Verify}
                      alt=""
                      width="22px"
                      style={{
                        verticalAlign: 'middle',
                        // filter: 'grayscale(100%)',
                        marginLeft: '4px',
                      }}
                    />
                  )}
                </Typography>
                <Typography
                  marginTop={2}
                  textAlign="center"
                  sx={{ lineBreak: 'anywhere' }}
                >
                  {jobTitle(profileData?.info.job, profileData?.info.company)}
                </Typography>
                <Divider sx={{ marginY: 2 }} />
                <Typography
                  textAlign="center"
                  variant="body2"
                  sx={{ lineBreak: 'anywhere' }}
                >
                  {profileData?.info.bio1}
                </Typography>
                <Typography
                  mt={1}
                  textAlign="center"
                  variant="body2"
                  sx={{ lineBreak: 'anywhere' }}
                >
                  {profileData?.info.bio2}
                </Typography>
                <Typography
                  mt={1}
                  textAlign="center"
                  variant="body2"
                  sx={{ lineBreak: 'anywhere' }}
                >
                  {profileData?.info.bio3}
                </Typography>
              </Box>
              <Grid
                container
                spacing={1}
                sx={{ marginTop: 2, marginBottom: { lg: 4 } }}
              >
                <Grid item xs={7}>
                  <Lead
                    isPreview={isPreview}
                    profileId={profileData?.info.profileId}
                  />
                </Grid>
                <Grid item xs={5}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    color="secondary"
                    startIcon={<PersonAddIcon />}
                    onClick={saveVCardHandler}
                  >
                    บันทึก
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Fade>
          <Fade
            in={true}
            timeout={{ enter: 1000 }}
            style={{
              transitionDelay: '100ms',
            }}
          >
            <Box>{ContactLists(contactItems)}</Box>
          </Fade>
        </Box>
      </Box>
      {!isPreview && (
        <Box textAlign="center" padding={2}>
          <Box
            onClick={goNewCreate}
            display="inline"
            sx={{ cursor: 'pointer' }}
          >
            <Img src={Logo} height={20} />
          </Box>
          <Typography variant="caption">powered by tikcard.me</Typography>
        </Box>
      )}
    </Box>
  );
};

export default View;
