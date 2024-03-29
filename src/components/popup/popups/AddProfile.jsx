import PopupWrapper from '@/components/popup/PopupWrapper';
import { Box, Chip, TextField, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { switchProfileToggle, addProfileToggle } from '@/stores/popup';
import { setPrimaryProfile, setSecondaryProfile } from '@/stores/account';
import { useCallback, useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import usePost from '@/hooks/axios/usePost';
import usePut from '@/hooks/axios/usePut';
import profileServicePath from '@/data/jsons/services/profile.service.json';

import toast from 'react-hot-toast';

const schema = yup
  .object({
    cardName: yup
      .string()
      .trim()
      .required('โปรดป้อนชื่อเรียกนามบัตร')
      .max(50, 'ต้องมีความยาวไม่เกิน 50 อักขระ'),
  })
  .required();

const AddProfile = () => {
  const open = useSelector((state) => state.popup.addProfilePopup);

  const {
    register,
    formState: { errors },
    clearErrors,
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [addProfileAction, addProfileLoading] = usePost(
    profileServicePath.getProfile,
    false
  );
  const [setPrimaryAction, setPrimaryLoading] = usePut(
    profileServicePath.setPrimaryProfile,
    false
  );
  const [setSecondaryAction, setSecondaryLoading] = usePut(
    profileServicePath.setSecondaryProfile,
    false
  );

  const switchProfileHeight = useSelector(
    (state) => state.layout.switchProfileHeight
  );

  useEffect(() => {
    if (open) {
      clearErrors();
      setValue('cardName', '');
    }
  }, [open]);

  const dispatch = useDispatch();

  const addProfileToggleHandler = useCallback(() => {
    dispatch(addProfileToggle());
  }, [dispatch]);

  const type = useSelector(
    (state) => state.controller.profileInUse.profileState
  );

  const save = (form) => {
    const body = {
      cardName: form.cardName,
    };
    addProfileAction(body).then(async (res) => {
      const profileId = res.data.returnData.id;
      if (type === 'primary') {
        await setPrimaryAction({}, profileId).then(() => {
          dispatch(setPrimaryProfile(profileId));
          toast.success('เพิ่มสำเร็จ');
        });
      } else if (type === 'secondary') {
        await setSecondaryAction({}, profileId).then(() => {
          dispatch(setSecondaryProfile(profileId));
          toast.success('เพิ่มสำเร็จ');
        });
      }
      addProfileToggleHandler();
      dispatch(switchProfileToggle());
    });
  };

  const selectedCardName = (cardName) => {
    setValue('cardName', cardName);
  };

  return (
    <PopupWrapper
      open={open}
      onClose={addProfileToggleHandler}
      onOpen={addProfileToggleHandler}
    >
      <Box height={`calc(${switchProfileHeight}px - 38px)`} position="relative">
        <Typography textAlign="center" marginBottom={2}>
          เพิ่มนามบัตร
        </Typography>
        <TextField
          label="ชื่อเรียกนามบัตร"
          placeholder="เลือก หรือ กรอกข้อมูล"
          variant="outlined"
          fullWidth
          InputLabelProps={{ shrink: true }}
          error={!!errors?.cardName}
          helperText={errors?.cardName?.message}
          {...register('cardName')}
        />
        <Box
          display="flex"
          gap={0.5}
          marginTop={2}
          alignItems="center"
          flexWrap="wrap"
        >
          <Chip
            label="ส่วนตัว"
            sx={{ cursor: 'pointer' }}
            onClick={() => selectedCardName('ส่วนตัว')}
          />
          <Chip
            label="ธุรกิจ"
            sx={{ cursor: 'pointer' }}
            onClick={() => selectedCardName('ธุรกิจ')}
          />
          <Chip
            label="งานออนไลน์"
            sx={{ cursor: 'pointer' }}
            onClick={() => selectedCardName('งานออนไลน์')}
          />
          <Typography variant="caption">หรือ ชื่องานที่คุณทำ</Typography>
        </Box>
        <Box position="absolute" width="100%" bottom={0}>
          <LoadingButton
            variant="contained"
            fullWidth
            size="large"
            color="secondary"
            onClick={handleSubmit(save)}
            loading={
              addProfileLoading || setPrimaryLoading || setSecondaryLoading
            }
          >
            เพิ่ม
          </LoadingButton>
        </Box>
      </Box>
    </PopupWrapper>
  );
};

export default AddProfile;
