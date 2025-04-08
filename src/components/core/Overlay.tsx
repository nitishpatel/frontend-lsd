import { Box } from '@mui/material';

const fullSizeStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};

const Overlay = ({ children, show = false }: { children?: JSX.Element; show?: boolean }) =>
  show ? (
    <Box
      sx={{
        ...fullSizeStyle,
        'z-index': 2
      }}
    >
      <Box
        sx={{
          ...fullSizeStyle,
          background: '#000000',
          opacity: 0.7
        }}
      />
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%'
        }}
      >
        {children}
      </Box>
    </Box>
  ) : null;

export default Overlay;
