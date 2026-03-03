from playwright.sync_api import sync_playwright

def verify_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context()

        # Mock auth cookies
        context.add_cookies([
            {
                "name": "auth_token",
                "value": "mock_token",
                "domain": "localhost",
                "path": "/"
            },
            {
                "name": "user_data",
                "value": '%7B%22username%22%3A%22TestUser%22%2C%22id%22%3A1%7D', # {"username":"TestUser","id":1}
                "domain": "localhost",
                "path": "/"
            }
        ])

        page = context.new_page()

        try:
            # Verify Missions Page
            print("Navigating to Missions...")
            page.goto("http://localhost:3000/dashboard/misiones", timeout=60000)
            page.wait_for_load_state("networkidle")
            page.screenshot(path="verification/misiones.png", full_page=True)
            print("Missions screenshot captured.")

            # Verify Ranking Page (Global)
            print("Navigating to Ranking...")
            page.goto("http://localhost:3000/dashboard/ranking", timeout=60000)
            page.wait_for_load_state("networkidle")
            page.screenshot(path="verification/ranking.png", full_page=True)
            print("Ranking (Global) screenshot captured.")

            # Verify Ranking Dialog (Click first player)
            # Use a more generic selector if get_by_text is flaky, or force it
            print("Clicking on player...")
            # Ensure the element is visible before clicking
            page.wait_for_selector("text=Reina Suprema", state="visible")
            page.get_by_text("Reina Suprema").first.click()

            print("Waiting for dialog...")
            page.wait_for_selector("div[role='dialog']", state="visible")
            # Give a moment for animation
            page.wait_for_timeout(1000)
            page.screenshot(path="verification/ranking_dialog.png")
            print("Ranking Dialog screenshot captured.")
        except Exception as e:
            print(f"Error during verification: {e}")
            page.screenshot(path="verification/error_state.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_changes()
