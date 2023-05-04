import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import copy from 'copy-to-clipboard';
import { LoadingButton } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import useGet from '@/hooks/axios/useGet';
import usePost from '@/hooks/axios/usePost';
import profileServicePath from '@/data/jsons/services/profile.service.json';

import { QRCodeSVG } from 'qrcode.react';

import toast from 'react-hot-toast';

const schema = yup
  .object({
    linkId: yup
      .string()
      .required('โปรดป้อนข้อมูล')
      .min(4, 'ต้องมีความยาวอย่างน้อย 4 อักขระ'),
  })
  .required();

const ShareBody = () => {
  const [linkIdCache, setLinkIdCache] = useState('');
  const [link, setLink] = useState('');
  const [openEditLink, setOpenEditLink] = useState(false);

  const {
    register,
    formState: { errors },
    clearErrors,
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const hasErrors = Object.keys(errors).length !== 0;

  const openEditLinkHandler = () => {
    clearErrors();
    setValue('linkId', linkIdCache);
    setOpenEditLink(true);
  };

  const closeEditLinkHandler = () => {
    setOpenEditLink(false);
  };

  const setLinkIdHandler = (linkId) => {
    setLinkIdCache(linkId);
    setLink('info.tikcard.me/' + linkId);
  };

  const profileActivationId = useSelector(
    (state) => state.controller.profileInUse.profileId
  );

  const [getLinkAction, getLinkLoading, getLinkData] = useGet(
    profileServicePath.getLink,
    true
  );

  const [updateLinkIdAction, updateLinkIdLoading] = usePost(
    profileServicePath.updateLinkId,
    false
  );

  const saveLinkId = (form) => {
    const body = {
      linkId: form.linkId,
    };
    updateLinkIdAction(body).then(() => {
      toast.success('แก้ไขสำเร็จ');
      setLinkIdHandler(form.linkId);
      closeEditLinkHandler();
    });
  };

  useEffect(() => {
    if (profileActivationId) {
      getLinkAction().then((res) => {
        setLinkIdHandler(res.data.linkId);
      });
    }
  }, [getLinkAction, profileActivationId]);

  const copyClipboard = () => {
    copy(link);
    toast.success('คัดลอกลิงค์');
  };

  return (
    <>
      {getLinkLoading || !getLinkData ? (
        <Box display="flex" justifyContent="center" marginY={4}>
          <CircularProgress disableShrink />
        </Box>
      ) : (
        <>
          <Box textAlign="center">
            <QRCodeSVG value={link} />
          </Box>
          <Typography variant="h2" textAlign="center">
            QR Code ของฉัน
          </Typography>
          <Box marginTop={2} display="flex" flexDirection="column" gap={1}>
            <Button
              variant="contained"
              fullWidth
              endIcon={<ContentCopyIcon />}
              sx={{ justifyContent: 'space-between' }}
              onClick={copyClipboard}
            >
              {link}
            </Button>
            <Box textAlign="center">
              <Button variant="text" onClick={openEditLinkHandler}>
                แก้ไข Link ID
              </Button>
            </Box>
          </Box>
          <Dialog
            open={openEditLink}
            PaperProps={{ sx: { margin: 2, width: '100%', borderRadius: 6 } }}
          >
            <DialogTitle>แก้ไข Link ID</DialogTitle>
            <DialogContent>
              <TextField
                label="Link ID"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ marginTop: 2 }}
                error={errors?.linkId ? true : false}
                helperText={errors?.linkId?.message}
                {...register('linkId')}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeEditLinkHandler}>ปิด</Button>
              <LoadingButton
                onClick={handleSubmit(saveLinkId)}
                loading={updateLinkIdLoading}
                disabled={hasErrors}
              >
                บันทึก
              </LoadingButton>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default ShareBody;
