import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import { useSelector } from 'react-redux';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StyleIcon from '@mui/icons-material/Style';

const deviceItem = (devices) => {
  if (devices.length) {
    return devices.map((device) => {
      return (
        <ListItem key={device.id}>
          <ListItemIcon>
            <StyleIcon sx={{ fontSize: 42 }} />
          </ListItemIcon>
          <ListItemText
            primary={device.DeviceType.name}
            secondary={'กำลังใช้งาน'}
          />
        </ListItem>
      );
    });
  }
  return (
    <Box textAlign="center">
      <Typography variant="body2">ซื้อสินค้า</Typography>
    </Box>
  );
};

const Device = () => {
  const devices = useSelector((state) => state.device.devices);

  return (
    <Accordion sx={{ boxShadow: 'none', borderBottom: '1px solid #F1F1F1' }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>
          Tik Device ที่เชื่อมต่อ ({devices.length ? devices.length : 'ไม่มี'})
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: '0px 16px' }}>
        <List sx={{ paddingTop: 0 }}>{deviceItem(devices)}</List>
      </AccordionDetails>
    </Accordion>
  );
};

export default Device;
