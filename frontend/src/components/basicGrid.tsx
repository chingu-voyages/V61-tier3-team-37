// import { styled } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
// import Grid from '@mui/material/Grid';

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: (theme.vars ?? theme).palette.text.secondary,
// }));

// export default function ColumnsGrid() {
//   return (
//     <Box sx={{ flexGrow: 1 }}>
//       <Grid container spacing={2} columns={5}>
//         {Array.from({ length: 30 }).map((_, index) => (
//           <Grid key={index} size={1}>
//             <Item>{index + 1}</Item>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// }