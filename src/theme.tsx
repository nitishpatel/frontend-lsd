import { createTheme, responsiveFontSizes } from '@mui/material';

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      background: {
        paper: '#131313',
        default: '#131313'
      }
      // mode: 'dark'
    },
    typography: {
      fontFamily: 'Poppins, Arial',
      allVariants: {
        color: '#ffffff'
      }
    },

    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            fontFamily: 'Poppins, Arial',
            color: '#ffffff'
          },
          h4: {
            color: '#DEE2EE'
          },
          caption: {
            color: '#888CA7'
          }
        }
      },
      MuiAlertTitle: {
        styleOverrides: {
          root: {
            color: '#000000'
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          outlinedPrimary: {
            backgroundColor: '#092448',
            color: '#fff',
            border: '1px solid #0D6FF0',
            textTransform: 'none',
            opacity: 1,
            ':disabled': {
              color: 'grey',
              backgroundColor: '#424347'
            }
          },
          containedPrimary: {
            ':disabled': {
              color: '#787276',
              backgroundColor: '#41424C'
            }
          },
          containedSecondary: {
            backgroundColor: '#424347',
            color: '#fff',
            textTransform: 'none',
            opacity: 1,
            ':disabled': {
              color: '#787276',
              backgroundColor: '#41424C'
            },
            '&:hover': {
              backgroundColor: '#1669df'
            }
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            color: '#ffffff',
            backgroundColor: '#000000',
            'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
              WebkitAppearance: 'none',
              margin: 0
            },
            'input[type=number]': {
              MozAppearance: 'textfield'
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#5D616D'
              }
              // '&:hover fieldset': {
              //   borderColor: '#00ff00'
              // },
              // '&.Mui-focused fieldset': {
              //   borderColor: '#ff0000'
              // }
            },
            '& .MuiInputBase-input': {
              color: '#ffffff'
            },
            '& .MuiInputLabel-root': {
              color: '#ffffff'
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#0D6FF0'
            },
            '& .MuiFilledInput-root': {
              color: '#ffffff', // Text color
              backgroundColor: '#131313', // Background color for filled variant
              borderTop: '2px solid #5D616D',
              '&:hover': {
                backgroundColor: '#333333', // Background color on hover
                borderTop: '2px solid #ffffff'
              },
              '&.Mui-focused': {
                backgroundColor: '#444444' // Background color when focused,
              },
              '&.Mui-disabled': {
                backgroundColor: '#111111', // Background color for disabled state
                color: '#ffffff' // Text color for disabled state
              }
            },
            '& .MuiFilledInput-root[readOnly]': {
              backgroundColor: '#111111', // Background color for read-only
              color: '#888888' // Text color for read-only
            }
          }
        }
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            color: '#ffffff',
            backgroundColor: '#000000',
            border: '1px solid #5D616D',
            '& .MuiSelect-icon': {
              color: '#ffffff'
            },
            '& .MuiSelect-select': {
              color: '#ffffff'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#0D6FF0'
            }
            // '&:hover .MuiOutlinedInput-notchedOutline': {
            //   borderColor: '#ffffff'
            // }
          }
        }
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            backgroundColor: '#131313',
            marginLeft: 0,
            marginRight: 0,
            color: '#d32f2f'
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: '#131313'
          }
        }
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            color: '#ffffff',
            '&.Mui-focused': {
              color: '#ff0000'
            },
            '&.Mui-error': {
              color: '#ff0000'
            }
          }
        }
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: '#16181D'
          }
        }
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: '1px solid #616161',
            color: '#ffffff'
          }
        }
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: '#ffffff'
          }
        }
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: '#ffffff'
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: {
            backgroundColor: '#244B81',
            color: '#ffffff'
          }
        }
      }
    }
  })
);

export default theme;
