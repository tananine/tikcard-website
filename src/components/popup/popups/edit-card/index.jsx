import { useCallback, useEffect, useState, useRef } from 'react';
import PopupWrapper from '@/components/popup/PopupWrapper';
import { useSelector, useDispatch } from 'react-redux';
import { editCardToggle } from '@/stores/popup';
import { setEditProfileHeight } from '@/stores/offset';
import { reloadCurrentProfile } from '@/stores/reload';
import { Box, Divider, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LoadingButton } from '@mui/lab';

import useGet from '@/hooks/axios/useGet';
import usePut from '@/hooks/axios/usePut';
import profileServicePath from '@/data/jsons/services/profile.service.json';

import ProfileImageHead from '@/components/popup/popups/edit-card/ProfileImageHead';

import toast from 'react-hot-toast';

const schema = yup
  .object({
    cardName: yup
      .string()
      .trim()
      .required('โปรดป้อนชื่อเรียกนามบัตร')
      .max(50, 'ต้องมีความยาวไม่เกิน 50 อักขระ'),
    name: yup.string().trim().max(50, 'ต้องมีความยาวไม่เกิน 50 อักขระ'),
    job: yup.string().trim().max(50, 'ต้องมีความยาวไม่เกิน 50 อักขระ'),
    company: yup.string().trim().max(50, 'ต้องมีความยาวไม่เกิน 50 อักขระ'),
    bio1: yup.string().trim().max(80, 'ต้องมีความยาวไม่เกิน 80 อักขระ'),
    bio2: yup.string().trim().max(80, 'ต้องมีความยาวไม่เกิน 80 อักขระ'),
    bio3: yup.string().trim().max(80, 'ต้องมีความยาวไม่เกิน 80 อักขระ'),
  })
  .required();

const EditCard = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [logoImage, setLogoImage] = useState(null);

  const [coverImageData, setCoverImageData] = useState(null);

  const editProfilePopupRef = useRef();

  const open = useSelector((state) => state.popup.editCardPopup);
  const profileId = useSelector(
    (state) => state.controller.profileInUse.profileId
  );

  const dispatch = useDispatch();

  const [getInformationAction] = useGet(
    profileServicePath.profileInformation,
    true
  );
  const [updateInformationAction, updateInformationLoading] = usePut(
    profileServicePath.profileInformation,
    false
  );

  const {
    register,
    formState: { errors },
    clearErrors,
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const editCardToggleHandler = useCallback(() => {
    dispatch(editCardToggle());
  }, [dispatch]);

  const clearData = () => {
    setProfileImage(null);
    setLogoImage(null);
  };

  useEffect(() => {
    if (editProfilePopupRef.current && open) {
      clearErrors();
      clearData();
      getInformationAction().then((res) => {
        setValue('cardName', res.data.cardName);
        setValue('name', res.data.name);
        setValue('job', res.data.job);
        setValue('company', res.data.company);
        setValue('bio1', res.data.bio1);
        setValue('bio2', res.data.bio2);
        setValue('bio3', res.data.bio3);
        setProfileImage(res.data.profileImage);
        setLogoImage(res.data.logoImage);
        setCoverImageData({
          coverImage: res.data.coverImage,
          colorCoverImage: res.data.colorCoverImage,
        });
      });
      dispatch(setEditProfileHeight(editProfilePopupRef.current.offsetHeight));
    }
  }, [getInformationAction, profileId, setValue, open]);

  const save = async (form) => {
    const formData = new FormData();
    formData.append('cardName', form.cardName);
    formData.append('name', form.name);
    formData.append('job', form.job);
    formData.append('company', form.company);
    formData.append('bio1', form.bio1);
    formData.append('bio2', form.bio2);
    formData.append('bio3', form.bio3);
    coverImageData.coverImage &&
      formData.append('coverImage', coverImageData.coverImage);
    coverImageData.colorCoverImage &&
      formData.append('colorCoverImage', coverImageData.colorCoverImage);

    if (profileImage?.split(':')[0] === 'blob') {
      const profileImageBlob = await fetch(profileImage);
      const profileImageObject = await profileImageBlob.blob();
      formData.append('profileImage', profileImageObject);
    }
    if (logoImage?.split(':')[0] === 'blob') {
      const logoImageBlob = await fetch(logoImage);
      const logoImageObject = await logoImageBlob.blob();
      formData.append('logoImage', logoImageObject);
    }

    updateInformationAction(formData).then(() => {
      dispatch(reloadCurrentProfile());
      dispatch(editCardToggle());
      toast.success('แก้ไขสำเร็จ');
    });
  };

  return (
    <PopupWrapper
      forwardedRef={editProfilePopupRef}
      open={open}
      onClose={editCardToggleHandler}
      onOpen={editCardToggleHandler}
    >
      <Box paddingY={1}>
        <TextField
          label={
            <>
              ชื่อเรียกนามบัตร{' '}
              <Typography component="span" color="red">
                *
              </Typography>
            </>
          }
          variant="outlined"
          fullWidth
          InputLabelProps={{ shrink: true }}
          error={!!errors?.cardName}
          helperText={errors?.cardName?.message}
          {...register('cardName')}
        />
        <Typography variant="caption" marginTop={1}>
          เช่น ส่วนตัว, ธุรกิจ, งานออนไลน์ หรือ ชื่องานที่คุณทำ
        </Typography>
        <Divider sx={{ marginTop: 4, marginBottom: 2 }} />
        <Typography variant="body2" textAlign="center">
          ข้อมูลด้านล่างนี้จะแสดงที่นามบัตร
        </Typography>
        <ProfileImageHead
          profileImage={profileImage}
          setProfileImage={setProfileImage}
          logoImage={logoImage}
          setLogoImage={setLogoImage}
          coverImageData={coverImageData}
          setCoverImageData={setCoverImageData}
        />
        <Box marginTop={8} display="flex" flexDirection="column" gap={2}>
          <TextField
            label="ชื่อ - นามสกุล"
            variant="outlined"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors?.name}
            helperText={errors?.name?.message}
            {...register('name')}
          />
          <TextField
            label="ตำแหน่ง หรือ งานที่ฉันทำ"
            variant="outlined"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors?.job}
            helperText={errors?.job?.message}
            {...register('job')}
          />
          <TextField
            label="ชื่อบริษัท"
            variant="outlined"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors?.company}
            helperText={errors?.company?.message}
            {...register('company')}
          />
          <Divider sx={{ marginTop: 2 }}>
            <Typography variant="body2">เกี่ยวกับฉัน</Typography>
          </Divider>
          <TextField
            label="บรรทัด 1"
            variant="outlined"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors?.bio1}
            helperText={errors?.bio1?.message}
            {...register('bio1')}
          />
          <TextField
            label="บรรทัด 2"
            variant="outlined"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors?.bio2}
            helperText={errors?.bio2?.message}
            {...register('bio2')}
          />
          <TextField
            label="บรรทัด 3"
            variant="outlined"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors?.bio3}
            helperText={errors?.bio3?.message}
            {...register('bio3')}
          />
        </Box>
        <Box
          paddingY={1}
          marginTop={8}
          position="sticky"
          bottom={0}
          zIndex={9}
          bgcolor="#ffffff"
        >
          <LoadingButton
            variant="contained"
            fullWidth
            size="large"
            color="secondary"
            onClick={handleSubmit(save)}
            loading={updateInformationLoading}
          >
            บันทึก
          </LoadingButton>
        </Box>
      </Box>
    </PopupWrapper>
  );
};

export default EditCard;
