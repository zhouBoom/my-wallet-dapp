// 钱包连接组件
// 实现功能：连接钱包、断开钱包、显示钱包地址
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button, Menu, MenuItem } from "@mui/material";

const WalletConnector = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // 菜单锚点

  const connectWallet = async () => {
    console.log("connectWallet");
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      try {
        const accounts = await provider.send("eth_requestAccounts", []);
        console.log("accounts", accounts);
        setAccount(accounts[0]);
        setIsButtonDisabled(false); // 连接成功，启用按钮
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        if (error.code === 4001) {
          alert("您已拒绝连接钱包，请重试。");
        } else {
          alert("连接钱包失败，请重试或检查您的钱包设置。");
        }
        setAccount(null); // 重置状态
        setIsButtonDisabled(true); // 禁用按钮
      }
    } else {
      alert("MetaMask is not installed!");
    }
  };

  const handleDisconnectClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // 打开菜单
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // 关闭菜单
  };

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; Max-Age=0; path=/;`; // 删除 cookie
  };

  const handleDisconnect = (clearUserStatus: boolean) => {
    setAccount(null); // 清除账户状态
    setIsButtonDisabled(false); // 启用连接按钮

    if (clearUserStatus) {
      // 清除用户状态的逻辑
      deleteCookie("selectWallet"); // 清除 selectWallet cookie
      alert("已断开连接并清除用户状态");
    } else {
      alert("已断开连接");
    }
    handleMenuClose(); // 关闭菜单
  };

  const handleRetry = () => {
    setIsButtonDisabled(false); // 启用按钮
    connectWallet(); // 再次尝试连接
  };

  useEffect(() => {
    // 监听账户变化
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setAccount(null);
      }
    };

    // 监听网络变化
    const handleChainChanged = () => {
      window.location.reload(); // 刷新页面以更新网络
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  return (
    <div>
      {account ? (
        <>
          <Button variant="outlined" onClick={handleDisconnectClick}>
            断开连接
          </Button>
          <span>已连接: {account.slice(0, 6)}...</span>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleDisconnect(false)}>仅断开连接</MenuItem>
            <MenuItem onClick={() => handleDisconnect(true)}>断开连接并清除用户状态</MenuItem>
          </Menu>
        </>
      ) : (
        <Button variant="outlined" onClick={connectWallet} disabled={isButtonDisabled}>
          连接钱包
        </Button>
      )}
      {isButtonDisabled && (
        <Button variant="outlined" onClick={handleRetry}>
          重试连接
        </Button>
      )}
    </div>
  );
}

export default WalletConnector;