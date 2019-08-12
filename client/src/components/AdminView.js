import { MuiThemeProvider } from '@material-ui/core';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton/IconButton';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import Typography from '@material-ui/core/Typography/Typography';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import * as PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { CONFIRM_MARK_DELIVERED, declineBook, getBooks } from '../reducers/books';
import themes from '../themes';
import AdminLogin from './AdminLogin';
import MarkDeliveredDialog from './MarkDeliveredDialog';


const mapStateToProps = ({ session, books }) => ({
  admin: session.authenticated && session.user && session.user.admin,
  books: books.booksByReserver,
  error: books.error
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getBooks,
      declineBook,
      confirmMarkDelivered: (reserver) => dispatch => dispatch({ type: CONFIRM_MARK_DELIVERED, reserver })
    }, dispatch
  );

class AdminView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      declined: {}
    };
    this.decline = (book) => {
      this.props.declineBook(book);
      this.setState({ declined: { ...this.state.declined, [book.isbn]: true } });
    };
  }

  componentWillMount() {
    this.props.getBooks();
  }

  render() {
    if (!this.props.admin) {
      return (
        <AdminLogin history={this.props.history}/>
      );
    }
    if (this.props.error) {
      return (
        <Typography>
          Error: {this.props.error}
        </Typography>
      );
    }

    if (this.props.books && Object.keys(this.props.books).length === 0) {
      return (
        <Typography>
          No reserved books
        </Typography>
      );
    }

    if (this.props.books) {
      return (
        <React.Fragment>
          <MarkDeliveredDialog/>
          <MuiThemeProvider theme={themes.narrow}>
            <List subheader={<li/>}>
              {
                Object.keys(this.props.books).map(reserver => {
                  const reserverName = this.props.books[reserver][0].reserverName;
                  return (
                    <li key={reserver}>
                      <ul style={{ listStyle: 'none' }}>
                        <ListSubheader>
                          <Typography variant="h6">
                            {reserverName}
                            <Tooltip title="Mark all delivered" aria-label="Mark all delivered">
                              <IconButton onClick={() => this.props.confirmMarkDelivered(reserver)} color="primary">
                                <DoneIcon/>
                              </IconButton>
                            </Tooltip>
                          </Typography>
                        </ListSubheader>
                        {
                          this.props.books[reserver]
                            .filter(book => !this.state.declined[book.isbn]).map(book => (
                            <ListItem key={book.isbn}>
                              <ListItemText inset primary={book.title} secondary={book.author}/>
                              <ListItemSecondaryAction>
                                <Tooltip title="Cancel reservation" aria-label="Cancel reservation">
                                  <IconButton onClick={() => this.decline(book)} color="secondary">
                                    <CloseIcon/>
                                  </IconButton>
                                </Tooltip>
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))
                        }
                      </ul>
                    </li>
                  );
                })
              }
            </List>
          </MuiThemeProvider>
        </React.Fragment>
      );
    }
    return null;
  }
}

AdminView.propTypes = {
  books: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({ reserverName: PropTypes.string })))
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminView);
