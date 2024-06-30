import styled, { keyframes, DefaultTheme, ThemedStyledProps } from 'styled-components';

interface LoadingType {
  isActive: boolean
}

type PropsType = ThemedStyledProps<LoadingType, DefaultTheme>;


const rotation = keyframes`
    from{
        transform: rotate(0deg);
    }
    to{
        transform: rotate(360deg);
    }
`;

export const Loading = styled.div<LoadingType>`
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	top: 0;
	background-color: rgba(255, 255, 255, 0);
	backdrop-filter: blur(2px);
	z-index: 9999;
	display: ${(props: PropsType) => props.isActive ? "flex" : "none"};
	justify-content: center;
	align-items: center;
	:after {
		content: '';
		display: block;
		height: 55px;
		width: 55px;
		border: 5px solid #E7C673;
		border-radius: 50%;
		border-top: none;
		border-right: none;
		margin: 16px auto;
		animation: ${rotation} 1s linear infinite;
	}
`;

export const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border: 5px solid rgba(195, 195, 195, 0.6);
  border-radius: 50%;
  border-top-color: #E7C673;
  animation: spin 1s ease-in-out infinite;
  -webkit-animation: spin 1s ease-in-out infinite;
  @keyframes spin {
    to {
      -webkit-transform: rotate(360deg);
    }
  }
  @-webkit-keyframes spin {
    to {
      -webkit-transform: rotate(360deg);
    }
  }
	`;

export const SpinnerOverlay = styled.div`
  /* height: 60vh; */
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Spinner = () => (
  <SpinnerOverlay>
    <SpinnerContainer />
  </SpinnerOverlay>
);
